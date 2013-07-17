/**
 * Eliademy
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

package com.cbtec.serviceeliademy;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;

import com.cbtec.eliademyutils.EliademyUtils;
import com.cbtec.lmsservice.LmsService;

import android.annotation.SuppressLint;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

public class EliademyService extends Service {

	@Override
	public void onCreate() {

		Log.d("EliademyService", "On create called");
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Log.d("EliademyService", "Received start id " + startId + ": " + intent);
		return START_STICKY;
	}

	@Override
	public void onDestroy() {
		Log.d("EliademyService", "On destroy called");
	}

	/**
	 * Class for clients to access.  Because we know this service always runs in
	 * the same process as its clients, we don't need to deal with IPC.      
	 */
	@Override
	public IBinder onBind(Intent intent) {
		return mBinder;
	}

	private final LmsService.Stub mBinder = new LmsService.Stub() {

		private String mToken = null;
		@SuppressWarnings("unused")
		private int mUserId = 0;
		private String TAG = "EliademyService";

		// Default client
		private String mServiceClient = "https://eliademy.com/";

		@Override
		public boolean deInitializeService(String data) {
			Log.d(TAG, "deinitialize service ");
			EliademyUtils.serviceCall(data, "local_monorailservices_user_logout", mToken, mServiceClient);
			mToken = null;
			mUserId = 0;
			return true;

		}

		@Override
		public String eliademyGetAssignments(String data) {
			Log.d(TAG, "get assignments");
			return EliademyUtils.serviceCall(data, "local_monorailservices_get_assignments", mToken, mServiceClient);

		}

		@Override
		public String eliademyGetCourseContents(String data) {
			Log.d(TAG, "get course contents");
			return EliademyUtils.serviceCall(data, "local_monorailservices_course_get_cont", mToken, mServiceClient);
		}

		@Override
		public String eliademyGetEnrolledUsers(String data) {
			Log.d(TAG, "eliademyGetEnrolledUsers");
			return EliademyUtils.serviceCall(data,"core_enrol_get_enrolled_users", mToken, mServiceClient);

		}

		@Override
		public String eliademyGetUsersCourses(String data) {
			Log.d(TAG, "get users courses");
			return EliademyUtils.serviceCall(data, "local_monorailservices_get_assignments", mToken, mServiceClient);
		}
		
		public String initializeSocialService(String data) {
			Log.d("EliademyUtils", "initializeService");
			try {
				JSONObject jsObj = new JSONObject(data.toString());
				DefaultHttpClient httpclient = new DefaultHttpClient();

				HttpPost httppost = new HttpPost(mServiceClient + "/theme/monorail/ext/ajax_get_stoken.php");

				List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
				nameValuePairs.add(new BasicNameValuePair("token", jsObj
						.get("accesstoken").toString()));
				nameValuePairs.add(new BasicNameValuePair("provider", jsObj
						.get("socialProvider").toString()));
				nameValuePairs.add(new BasicNameValuePair("email", jsObj
						.get("email").toString()));
				nameValuePairs.add(new BasicNameValuePair("service",jsObj.getString("mwsshortname")));
				httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

				HttpResponse response = httpclient.execute(httppost);

				HttpEntity entity = response.getEntity();
				if (entity != null) {
					StringBuilder jsonStr = new StringBuilder();
					InputStream iStream = entity.getContent();
					BufferedReader bufferReader = new BufferedReader(
							new InputStreamReader(iStream));
					String jpart;
					while ((jpart = bufferReader.readLine()) != null) {
						jsonStr.append(jpart);
					}
					iStream.close();
					Log.d("Eliademy", jsonStr.toString());
					JSONObject jsonObj = new JSONObject(jsonStr.toString());
					return (String) jsonObj.get("token");
				}
			} catch (Exception e) {
				Log.e("EliademyUtils", "exception", e);
				return null;
			}
			return null;
		}
		
		@SuppressLint("NewApi")
		@Override
		public boolean initializeService(String data) {
			Log.d(TAG, "initializeService");
			try {
				JSONObject jsObj = new JSONObject(data.toString());
				mServiceClient = jsObj.getString("serviceurl");
				if(jsObj.getString("loginType").contentEquals("social")) {
					mToken = initializeSocialService(data);
				} else {
				    mToken = EliademyUtils.initializeService(data, jsObj.getString("mwsshortname"), mServiceClient);
				}
			    if(mToken.isEmpty()) {
			    	return false;
			    }			    
			    return true;
			} catch (Exception e) {
				Log.e(TAG, "exception", e);
				return false;
			}
		}

		@SuppressLint("NewApi")
		@Override
		public String eliademyGetSiteInformation(String data) {
			String retval = null;
			retval = EliademyUtils.serviceCall(data, "core_webservice_get_site_info", mToken, mServiceClient);
			if (!retval.isEmpty()) {
				try {
					JSONObject jsonObj = new JSONObject(retval);
					mUserId = (Integer) jsonObj.get("userid");
				} catch (Exception e) {
					Log.e("Eliademy", "exception", e);
					return null;
				}
			}
			return retval;
		}

		@Override
		public String eliademyGetUserInformation(String data) {
			return EliademyUtils.serviceCall(data, "local_monorailservices_get_users_by_id", mToken, mServiceClient);
		}

		@Override
		public String eliademyGetWebServiceToken() throws RemoteException {
			return mToken;
		}

		@Override
		public String eliademyExecWebService(String service, String data)
				throws RemoteException {
			return EliademyUtils.serviceCall(data, service, mToken, mServiceClient);
		}

		private boolean pushNotifications(String data, String url)
				throws RemoteException {
			Log.d(TAG, "pushNotifications");
			try {
				List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
				if (data.toString().length() > 0) {
					JSONObject jsObj = new JSONObject(data.toString());
					nameValuePairs.addAll(EliademyUtils.nameValueJson(jsObj, ""));
				}

				DefaultHttpClient httpclient = new DefaultHttpClient();
				HttpPost httppost = new HttpPost(mServiceClient
						+ url);
				httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

				HttpResponse response = httpclient.execute(httppost);

				HttpEntity entity = response.getEntity();
				if (entity != null) {
					StringBuilder jsonStr = new StringBuilder();
					InputStream iStream = entity.getContent();
					BufferedReader bufferReader = new BufferedReader(
							new InputStreamReader(iStream));
					String jpart;
					while ((jpart = bufferReader.readLine()) != null) {
						jsonStr.append(jpart);
					}
					iStream.close();
					JSONObject jsonObj = new JSONObject(jsonStr.toString());
					boolean retval = (Boolean) jsonObj.get("registered");
					Log.d(TAG, "Registered: " + retval);
					return retval;
				}
			} catch (Exception e) {
				Log.e("Eliademy", "exception", e);
				return false;
			}
			return false;
		}

		@Override
		public boolean unregisterPushNotifications(String data)
				throws RemoteException {
			return pushNotifications(data,
					"/local/pushnotifications/ext/unregister.php");
		}

		@Override
		public boolean registerPushNotifications(String data)
				throws RemoteException {
			return pushNotifications(data,
					"/local/pushnotifications/ext/register.php");
		}

		@Override
		public String eliademyGetUserForums(String data) throws RemoteException {
			return EliademyUtils.serviceCall(data, "local_monorailservices_get_forums", mToken, mServiceClient);
		}
	};
}
