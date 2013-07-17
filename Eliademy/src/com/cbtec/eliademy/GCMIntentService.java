/**
 * The MIT License
 * 
 * Copyright (c) 2013 Mark Nutter
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 * of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.cbtec.eliademy;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.cbtec.eliademy.R;
import com.google.android.gcm.GCMBaseIntentService;
import com.google.android.gcm.GCMRegistrar;

/**
 * IntentService responsible for handling GCM messages.
 */
public class GCMIntentService extends GCMBaseIntentService {

	private static final String TAG = "GCMIntentService";

	public GCMIntentService() {
		super(TAG);
	}

	@Override
	protected void onRegistered(Context context, String registrationId) {
		Log.d(TAG, "Device registered: regId = " + registrationId);
		JSONObject json;

		try {
			json = new JSONObject().put("event", "registered");
			json.put("registrationId", registrationId);
			Log.v(TAG, json.toString());
			GCMPlugin.sendJavascript(json);
		} catch (JSONException e) {
			Log.e(TAG, "JSON exception: " + e.getMessage());
		}
	}

	@Override
	protected void onUnregistered(Context context, String registrationId) {
		Log.d(TAG, "Device unregistered");
		if (GCMRegistrar.isRegisteredOnServer(context)) {
			try {
				JSONObject json;
				json = new JSONObject().put("event", "unregistered");
				json.put("registrationId", registrationId);
				Log.v(TAG, json.toString());
				GCMPlugin.sendJavascript(json);
			} catch (JSONException e) {
				Log.e(TAG, "JSON exception" + e.getMessage());
			}
		} else {
			// This callback results from the call to unregister made on
			// ServerUtilities when the registration to the server failed.
			Log.d(TAG, "Ignoring unregister callback");
		}
	}

	@Override
	protected void onMessage(Context context, Intent intent) {
		Bundle extras = intent.getExtras();
		Log.d(TAG, "Received message" + extras.toString());
		if (extras != null) {
			try {
				JSONObject json;
				json = new JSONObject().put("event", "notifications");
				json.put("notifications", extras.getString("notifications"));

				Log.v(TAG, json.toString());
				if (GCMPlugin.isActive()) {
					// TODO: Find better way
					JSONObject msgobj = new JSONObject(
							extras.getString("notifications"));
					String msg = msgobj.getString("author") + " "
							+ msgobj.getString("content") + " for course "
							+ msgobj.getString("coursename");
					generateNotification(context, msg);
					GCMPlugin.sendJavascript(json);
				} else {
					// form message
					JSONObject msgobj = new JSONObject(
							extras.getString("notifications"));
					String msg = msgobj.getString("author") + " "
							+ msgobj.getString("content") + " for course "
							+ msgobj.getString("coursename");
					generateNotification(context, msg);
				}
			} catch (JSONException e) {
				Log.e(TAG, "JSON exception" + e.getMessage());
			}
		}
	}

	@Override
	protected void onDeletedMessages(Context context, int total) {
		Log.d(TAG, "Received deleted messages notification");
	}

	@Override
	public void onError(Context context, String error) {
		Log.d(TAG, "Received error: " + error);
		try {
			JSONObject json;
			json = new JSONObject().put("event", "error");
			json.put("error", error);
			GCMPlugin.sendJavascript(json);
		} catch (JSONException e) {
			Log.e(TAG, "JSON exception" + e.getMessage());
		}
	}

	@Override
	protected boolean onRecoverableError(Context context, String error) {
		Log.d(TAG, "Received recoverable error: " + error);
		return super.onRecoverableError(context, error);
	}

	//Samples : https://code.google.com/p/gcm/source/browse/samples/gcm-demo-client/src/com/google/android/gcm/demo/app/GCMIntentService.java
	/*
	 * Copyright 2012 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * Issues a notification to inform the user that server has sent a message.
	 */
	
	private static void generateNotification(Context context, String message) {
		int icon = R.drawable.icon;
		long when = System.currentTimeMillis();
		NotificationManager notificationManager = (NotificationManager) context
				.getSystemService(Context.NOTIFICATION_SERVICE);
		Notification notification = new Notification(icon, message, when);
		String title = context.getString(R.string.app_name);
		Intent notificationIntent = new Intent(context, Eliademy.class);
		// set intent so it does not start a new activity
		notificationIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP
				| Intent.FLAG_ACTIVITY_SINGLE_TOP);
		PendingIntent intent = PendingIntent.getActivity(context, 0,
				notificationIntent, 0);
		notification.setLatestEventInfo(context, title, message, intent);
		notification.flags |= Notification.FLAG_AUTO_CANCEL;
		notificationManager.notify(0, notification);
	}
}