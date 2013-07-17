/*
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

/**
 * Eliademy
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

package com.cbtec.eliademy;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.android.gcm.GCMRegistrar;

import android.content.Intent;
import android.util.Log;

public class GCMPlugin extends CordovaPlugin {

	private static boolean mSession = false;
	public static CordovaWebView mwebView;
	private static String mEcb;
	private static String mSenderID;

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

		Log.d("GCM", action);

		mSession = true;

		if (action.equals("register")) {
			try {
				JSONObject json = new JSONObject(data.toString().substring(1,
						data.toString().length() - 1));
				mwebView = this.webView;
				mEcb = json.getString("ecb");
				mSenderID = json.getString("senderID");

				GCMRegistrar.register(this.cordova.getActivity(), mSenderID);
				return true;
			} catch (JSONException e) {
				Log.e("GCM", "Exception " + e.getMessage());
			}
		} else if (action.equals("unregister")) {
			GCMRegistrar.unregister(this.cordova.getActivity());
			return true;
		} else {
			Log.e("GCM", "Invalid action: " + action);
		}
		return false;
	}

	public static void sendJavascript(JSONObject _json) {
		String jsp = "javascript:" + mEcb + "(" + _json.toString() + ")";
		Log.d("GCM", jsp);
		if (mEcb != null) {
			mwebView.sendJavascript(jsp);
		}
	}

	public static boolean isActive() {
		return mSession;
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
