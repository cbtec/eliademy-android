/**
 * Eliademy
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

package com.cbtec.eliademy;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.database.Cursor;
import android.net.Uri;
import android.os.IBinder;
import android.provider.MediaStore.MediaColumns;
import android.util.Log;

import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.cbtec.lmsservice.LmsService;

public class EliademyLms extends CordovaPlugin {

	private LmsService mIBinder = null;
	private boolean mIsBound = false;
	private CallbackContext mCallbackContext;
	private final int submitFileCode = 1001;
	private String mServiceName = "com.cbtec.servicemoodle22";

	private ServiceConnection mConnection = new ServiceConnection() {
		@Override
		public void onServiceConnected(ComponentName className, IBinder service) {
			mIBinder = LmsService.Stub.asInterface(service);
			Log.i("HLMS", "Service connection initialized");
			mCallbackContext.success();
			mCallbackContext = null;
		}

		@Override
		public void onServiceDisconnected(ComponentName className) {
			mIBinder = null;
		}
	};

	void doBindService() {
		cordova.getActivity().bindService(new Intent(mServiceName),
				mConnection,
				cordova.getActivity().getApplicationContext().BIND_AUTO_CREATE);
		mIsBound = true;
	}

	void doUnbindService() {
		if (mIsBound) {
			cordova.getActivity().unbindService(mConnection);
			mIsBound = false;
		}
	}

	/**
	 * Executes the request.
	 * 
	 * This method is called from the WebView thread. To do a non-trivial amount
	 * of work, use: cordova.getThreadPool().execute(runnable);
	 * 
	 * To run on the UI thread, use:
	 * cordova.getActivity().runOnUiThread(runnable);
	 * 
	 * @param action
	 *            The action to execute.
	 * @param rawArgs
	 *            The exec() arguments in JSON form.
	 * @param callbackContext
	 *            The callback context used when calling back into JavaScript.
	 * @return Whether the action was valid.
	 * @throws JSONException
	 */
	@Override
	public boolean execute(String action, JSONArray data,
			final CallbackContext callbackContext) throws JSONException {

		Log.i("HLMS", action);

		if ((action.compareTo("openfilesrv") == 0)) {
			try {
				Uri fileuri = Uri.parse(data.getString(0));
				Intent intent = new Intent(Intent.ACTION_VIEW);
				String mimeextn = android.webkit.MimeTypeMap
						.getFileExtensionFromUrl(data.getString(0));
				if(mimeextn.isEmpty()){
					mimeextn = data.getString(0).substring(data.getString(0).indexOf(".")+1);;
				}
				String mimetype = android.webkit.MimeTypeMap.getSingleton()
						.getMimeTypeFromExtension(mimeextn);
				Log.i("HLMS", fileuri + "  " + mimetype);
				intent.setDataAndType(fileuri, mimetype);
				intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				cordova.getActivity().getApplicationContext()
				.startActivity(intent);
				callbackContext.success();
			} catch (Exception e) {
				Log.e("HLMS", "exception", e);
				callbackContext.error(0);
			}
			return true;
		} else if ((action.compareTo("getfilesrv") == 0)) {
			this.mCallbackContext = callbackContext;
			cordova.getThreadPool().execute(new Runnable() {
				@Override
				public void run() {
					try {
						Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
						intent.setType("*/*");// TODO: Restrict file types
						cordova.startActivityForResult(EliademyLms.this,
								intent, submitFileCode);
					} catch (Exception e) {
						Log.e("HLMS", "exception", e);
						callbackContext.error(0);
					}
					return;
				}
			});
		} else if ((action.compareTo("initservice") == 0)) {
			if (!mIsBound) {
				this.mCallbackContext = callbackContext;
				JSONObject tmp = new JSONObject(data.getString(0));
				String sname = tmp.getString("servicename");
				if (sname.contains("eliademy")) {
					mServiceName = "com.cbtec.serviceeliademy";
				} else {
					// From url determine version 2.2, 2.3, 2.4 and change
					mServiceName = "com.cbtec.service" + sname;
				}
				Log.i("HLMS", "Connecting to service: " + mServiceName);
				doBindService();
			} else {
				callbackContext.success();
			}
			return true;
		} else {
			final String aAction = action;
			final JSONArray aData = data;
			String mappedCmd = null;
			try {
				mappedCmd = mapExecCommand(aData.getString(0));
			} catch (JSONException e) {
				Log.e("HLMS", "exception", e);
			}
			if (mappedCmd == null) {
				Log.i("HLMS", "LMS service call failed " + mappedCmd);
				callbackContext.error(0);// TODO : error enum
				return false;
			}

			final String execCmd = mappedCmd;
			cordova.getThreadPool().execute(new Runnable() {
				@Override
				@SuppressLint("NewApi")
				public void run() {
					Log.i("HLMS",
							"Runner execute " + aAction + aData.toString());
					if (aAction.compareTo("lmsservice") == 0) {
						try {
							String retval = null;
							Log.i("HLMS", "Execute cmd: " + execCmd);
							if (execCmd.compareTo("initialize") == 0) {
								if (mIBinder.initializeService(aData
										.getString(1))) {
									String token = mIBinder
											.eliademyGetWebServiceToken();
									callbackContext.success(token);
									return;
								}
							} else if (execCmd.compareTo("deinitialize") == 0) {
								if (mIBinder.deInitializeService(aData
										.getString(1))) {
									doUnbindService();
									callbackContext.success();
									return;
								}
							} else if (execCmd.compareTo("pushregister") == 0) {
								Log.i("pushdata", aData.getString(1));
								if (mIBinder.registerPushNotifications(aData
										.getString(1))) {
									callbackContext.success();
									return;
								}
							} else if (execCmd.compareTo("pushunregister") == 0) {
								Log.i("pushdata", aData.getString(1));
								if (mIBinder.unregisterPushNotifications(aData
										.getString(1))) {
									callbackContext.success();
									return;
								}
							} else if (execCmd.compareTo("servicetoken") == 0) {
								retval = mIBinder.eliademyGetWebServiceToken();
							} else if (execCmd.compareTo("siteinfo") == 0) {
								retval = mIBinder
										.eliademyGetSiteInformation(aData
												.getString(1));
							} else if (execCmd.compareTo("get_user_courses") == 0) {
								retval = mIBinder.eliademyGetUsersCourses(aData
										.getString(1));
							} else if (execCmd.compareTo("get_user_forums") == 0) {
								retval = mIBinder.eliademyGetUserForums(aData
										.getString(1));
							} else if (execCmd.compareTo("get_user_info") == 0) {
								retval = mIBinder
										.eliademyGetUserInformation(aData
												.getString(1));
							} else if (execCmd.compareTo("exec_webservice") == 0) {
								Log.i("HLMS", "Execute webservice");
								retval = mIBinder.eliademyExecWebService(
										aData.getString(0), aData.getString(1));
							} else if (execCmd.compareTo("course_get_contents") == 0) {
								retval = mIBinder.eliademyGetCourseContents(aData
										.getString(1));
							} else if (execCmd
									.compareTo("course_get_enrolled_users") == 0) {
								retval = mIBinder.eliademyGetEnrolledUsers(aData
										.getString(1));
							} else {
								Log.i("HLMS", "LMS service failed " + execCmd);
								callbackContext.error(0);// TODO : error enum
							}
							if (!retval.isEmpty()) {
								Log.i("HLMS", "LMS service call success");
								callbackContext.success(retval);
							} else {
								Log.i("HLMS", "LMS service call failed");
								callbackContext.error(0);// TODO : error enum
							}
						} catch (Exception e) {
							Log.e("HLMS", "exception", e);
							callbackContext.error(e.getMessage());
							return;
						}
					} else {
						Log.i("LMS", "Unsupported action call !!");
						callbackContext.error(0);
						return;
					}
				}
			});
		}
		return true;
	}

	private String mapExecCommand(String service) {
		String[] reqFunct = { "siteinfo", "initialize", "deinitialize" };
		if (Arrays.asList(reqFunct).contains(service)) {
			return service;
		}

		if (mServiceName.contains("serviceeliademy")) {
			if ((service.compareTo("pushregister") == 0)
					|| (service.compareTo("pushunregister") == 0)) {
				return service;
			} else if (service.contains("local_monorailservices")
					|| service.contains("core_enrol_get_enrolled_users")) {
				return "exec_webservice";
			} else {
				return null;
			}
		} else {
			// TODO: Add support for diff versions
			// Map of monorail sevices to moodle services...
			Map<String, String> moodleSupport = new HashMap<String, String>();
			moodleSupport.put("local_monorailservices_get_users_by_id",
					"get_user_info");
			moodleSupport.put("local_monorailservices_get_assignments",
					"get_user_courses");
			moodleSupport.put("local_monorailservices_course_get_cont",
					"course_get_contents");
			moodleSupport.put("core_enrol_get_enrolled_users",
					"course_get_enrolled_users");
			moodleSupport.put("local_monorailservices_get_forums",
					"get_user_forums");

			return moodleSupport.get(service);
		}
	}

	/**
	 * Called when the system is about to start resuming a previous activity.
	 * 
	 * @param multitasking
	 *            Flag indicating if multitasking is turned on for app
	 */
	@Override
	public void onPause(boolean multitasking) {
	}

	/**
	 * Called when the activity will start interacting with the user.
	 * 
	 * @param multitasking
	 *            Flag indicating if multitasking is turned on for app
	 */
	@Override
	public void onResume(boolean multitasking) {
	}

	/**
	 * Called when the activity receives a new intent.
	 */
	@Override
	public void onNewIntent(Intent intent) {
	}

	/**
	 * The final call you receive before your activity is destroyed.
	 */
	@Override
	public void onDestroy() {
		super.onDestroy();
		doUnbindService();
	}

	/**
	 * Called when a message is sent to plugin.
	 * 
	 * @param id
	 *            The message id
	 * @param data
	 *            The message data
	 * @return Object to stop propagation or null
	 */
	@Override
	public Object onMessage(String id, Object data) {
		return null;
	}

	/**
	 * Called when an activity you launched exits, giving you the requestCode
	 * you started it with, the resultCode it returned, and any additional data
	 * from it.
	 * 
	 * @param requestCode
	 *            The request code originally supplied to
	 *            startActivityForResult(), allowing you to identify who this
	 *            result came from.
	 * @param resultCode
	 *            The integer result code returned by the child activity through
	 *            its setResult().
	 * @param data
	 *            An Intent, which can return result data to the caller (various
	 *            data can be attached to Intent "extras").
	 */
	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		switch (requestCode) {
		case submitFileCode:
			if (resultCode == Activity.RESULT_OK) {
				Uri uri = intent.getData();
				if (uri.getScheme().toString().compareTo("content") == 0) {
					Cursor cursor = cordova.getActivity()
							.getApplicationContext().getContentResolver()
							.query(uri, null, null, null, null);
					if (cursor.moveToFirst()) {
						int column_index = cursor
								.getColumnIndexOrThrow(MediaColumns.DATA);
						uri = Uri.parse(cursor.getString(column_index));
					}
				}
				if (this.mCallbackContext != null) {
					this.mCallbackContext.success(uri.toString());
					return;
				} else {
					Log.i("HLMS", "callback context is null");
				}
			}
			break;
		}
		if (this.mCallbackContext != null) {
			this.mCallbackContext.error(resultCode);
		} else {
			Log.i("HLMS", "callback context is null");
		}
	}

	/**
	 * By specifying a <url-filter> in plugins.xml you can map a URL (using
	 * startsWith atm) to this method.
	 * 
	 * @param url
	 *            The URL that is trying to be loaded in the Cordova webview.
	 * @return Return true to prevent the URL from loading. Default is false.
	 */
	@Override
	public boolean onOverrideUrlLoading(String url) {
		return false;
	}

	/**
	 * Called when the WebView does a top-level navigation or refreshes.
	 * 
	 * Plugins should stop any long-running processes and clean up internal
	 * state.
	 * 
	 * Does nothing by default.
	 */
	@Override
	public void onReset() {
	}
}
