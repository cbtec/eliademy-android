/**
 * Eliademy
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

package com.cbtec.servicemoodle22;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.cbtec.eliademyutils.*;
import com.cbtec.lmsservice.LmsService;

import android.annotation.SuppressLint;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

public class MoodleService22 extends Service {
	
	private String TAG = "Moodle22";
	@Override
	public void onCreate() {

		Log.d(TAG, "On create called");
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Log.d(TAG, "Received start id " + startId + ": " + intent);
		// This mode makes sense for things that will be explicitly started and
		// stopped to run for arbitrary periods of time
		return START_STICKY;
	}

	@Override
	public void onDestroy() {
		Log.d(TAG, "On destroy called");
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
		private int mUserId = 0;
		private String mServiceClient = null;
		

		@Override
		public boolean deInitializeService(String data) {
			Log.d(TAG, "deinitialize service ");
			mToken = null;
			mUserId = 0;
			return true;

		}

		@Override
		public String eliademyGetAssignments(String data) {
			Log.d(TAG, "eliademyGetAssignments");
			return EliademyUtils.serviceCall(data, "core_course_get_courses",
					mToken, mServiceClient);
		}

		@Override
		public String eliademyGetCourseContents(String data) {
			Log.d(TAG, "eliademyGetCourseContents");
			return EliademyUtils.serviceCall(data, "core_course_get_contents",
					mToken, mServiceClient);
		}

		@Override
		public String eliademyGetEnrolledUsers(String data) {
			Log.d(TAG, "eliademyGetEnrolledUsers");
			return EliademyUtils.serviceCall(data,
					"core_enrol_get_enrolled_users", mToken, mServiceClient);
		}

		@Override
		public String eliademyGetUsersCourses(String data) {
			Log.d(TAG, "eliademyGetUsersCourses");
			String retval = null;
			JSONObject jsonObj = new JSONObject();
			try {
				jsonObj.put("userid", mUserId);
			} catch (JSONException e) {
				Log.e("Moodle", "exception", e);
			}
			retval = EliademyUtils.serviceCall(jsonObj.toString(),
					"core_enrol_get_users_courses", mToken, mServiceClient);
			JSONObject resObj = new JSONObject();
			try {
				JSONArray rval = new JSONArray(retval);
				for (int i = 0; i < rval.length(); i++) {
					JSONObject tmp = (JSONObject) rval.get(i);
					// TODO: Required by UI , code property
					tmp.put("code", tmp.get("id").toString() + "moodle22");

					// Get course assignment details!
					JSONObject cObj = new JSONObject();
					cObj.put("courseid", tmp.get("id"));
					String coursedetails = EliademyUtils.serviceCall(
							cObj.toString(), "core_course_get_contents",
							mToken, mServiceClient);
					JSONArray crsVal = new JSONArray(coursedetails);
					for (int j = 0; j < crsVal.length(); j++) {
						JSONObject t = (JSONObject) crsVal.get(j);
						JSONArray assign = new JSONArray();
						JSONArray modules = (JSONArray) t.get("modules");
						for (int m = 0; m < modules.length(); m++) {
							JSONObject ms = (JSONObject) modules.get(m);
							if (ms.getString("modname").compareTo("assign") == 0) {
								JSONObject asign = new JSONObject();
								asign.put("id", ms.getInt("id"));
								asign.put("instanceid", ms.getInt("id"));
								asign.put("courseid", tmp.get("id"));
								asign.put("name", ms.getString("name"));
								asign.put("visible", ms.getInt("visible"));
								asign.put("modulename", ms.getString("modname"));
								asign.put("canedit", 0);
								asign.put("haveSubmissions", 0);
								assign.put(asign);
							}
						}
						tmp.put("assignments", assign);
					}
				}
				resObj.put("courses", rval);
			} catch (JSONException e) {
				Log.e("Moodle", "exception", e);
			}
			return resObj.toString();
		}

		@SuppressLint("NewApi")
		@Override
		public boolean initializeService(String data) {
			Log.d(TAG, "initializeService");
			try {
				JSONObject jsObj = new JSONObject(data.toString());
				mServiceClient = jsObj.getString("serviceurl");
				mToken = EliademyUtils.initializeService(data,
						jsObj.getString("mwsshortname"), mServiceClient);
				if (mToken.isEmpty()) {
					return false;
				}
				return true;
			} catch (Exception e) {
				Log.e("Moodle", "exception", e);
				return false;
			}
		}

		@SuppressLint("NewApi")
		@Override
		public String eliademyGetSiteInformation(String data) {
			String retval = null;
			retval = EliademyUtils.serviceCall(data,
					"core_webservice_get_site_info", mToken, mServiceClient);
			if (!retval.isEmpty()) {
				try {
					JSONObject jsonObj = new JSONObject(retval);
					mUserId = (Integer) jsonObj.get("userid");
				} catch (Exception e) {
					Log.e("Moodle", "exception", e);
					return null;
				}
			}
			return retval;

		}

		@Override
		public String eliademyGetUserInformation(String data) {
			String retval = null;
			JSONArray userids = new JSONArray();
			userids.put(mUserId);

			JSONObject jsonObj = new JSONObject();
			try {
				jsonObj.put("userids", userids);
			} catch (JSONException e) {
				Log.e("Moodle", "exception", e);
				return retval;
			}
			retval = EliademyUtils.serviceCall(jsonObj.toString(),
					"core_user_get_users_by_id", mToken, mServiceClient);
			return retval;
		}

		@Override
		public String eliademyGetWebServiceToken() throws RemoteException {
			return mToken;
		}

		@Override
		public String eliademyExecWebService(String service, String data)
				throws RemoteException {
			// TODO Auto-generated method stub
			return null;
		}

		@Override
		public boolean registerPushNotifications(String data)
				throws RemoteException {
			// TODO Auto-generated method stub
			return false;
		}

		@Override
		public boolean unregisterPushNotifications(String data)
				throws RemoteException {
			// TODO Auto-generated method stub
			return false;
		}

		@Override
		public String eliademyGetUserForums(String data) throws RemoteException {
			// TODO Auto-generated method stub
			return null;
		}
	};
}
