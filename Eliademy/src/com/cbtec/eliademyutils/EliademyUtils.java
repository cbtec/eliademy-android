/**
 * Eliademy
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

package com.cbtec.eliademyutils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.annotation.SuppressLint;
import android.util.Log;

public class EliademyUtils {

	public static String serviceCall(String data, String webService, String token,
			String serviceClient) {

		String retval = null;
		Log.d("EliademyUtils", "Service: " + data + " Service: " + webService);

		try {
			DefaultHttpClient httpclient = new DefaultHttpClient();
			List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();

			if (data.toString().length() > 0) {
				JSONObject jsObj = new JSONObject(data.toString());
				nameValuePairs.addAll(nameValueJson(jsObj, ""));
			}
			nameValuePairs.add(new BasicNameValuePair("wstoken", token));
			nameValuePairs
					.add(new BasicNameValuePair("wsfunction", webService));
			nameValuePairs.add(new BasicNameValuePair("moodlewsrestformat",
					"json"));

			HttpPost httppost = new HttpPost(serviceClient
					+ "/webservice/rest/server.php?");

			Log.d("EliademyUtils", nameValuePairs.toString());
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
				return jsonStr.toString();
			}
		} catch (Exception e) {
			Log.e("EliademyUtils", "exception", e);
			return retval;
		}
		return retval;
	}

	@SuppressLint("NewApi")
	public static List<NameValuePair> nameValueJson(JSONObject aObj, String akeyprefix) {
		Iterator<?> keys = aObj.keys();
		int index = 0;
		String keyfordata = null;
		List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
		while (keys.hasNext()) {
			String key = (String) keys.next();
			if (akeyprefix.isEmpty()) {
				keyfordata = key;
			} else {
				keyfordata = akeyprefix + "[" + key + "]";
			}
			try {
				if (aObj.get(key) instanceof JSONObject) {
					List<NameValuePair> rnameValuePairs = nameValueJson(
							(JSONObject) aObj.get(key), keyfordata);
					nameValuePairs.addAll(rnameValuePairs);
				} else if (aObj.get(key) instanceof JSONArray) {
					JSONArray jarray = (JSONArray) aObj.get(key);
					for (int i = 0; i < jarray.length(); i++) {
						JSONObject row = jarray.optJSONObject(i);
						if (row != null) {
							List<NameValuePair> rnameValuePairs = nameValueJson(
									row, keyfordata + "[" + i + "]");
							nameValuePairs.addAll(rnameValuePairs);
						} else {
							nameValuePairs.add(new BasicNameValuePair(key + '['
									+ i + ']', jarray.get(i).toString()));
						}
					}
				} else {
					nameValuePairs.add(new BasicNameValuePair(keyfordata, aObj
							.getString(key)));
				}
			} catch (JSONException e) {
				Log.e("EliademyUtils", "exception", e);
				return nameValuePairs;
			}
			index = index + 1;
		}
		return nameValuePairs;
	}
	
	public static String initializeService(String data, String serviceName, String serviceUrl) {
		Log.d("EliademyUtils", "initializeService");
		try {
			JSONObject jsObj = new JSONObject(data.toString());
			DefaultHttpClient httpclient = new DefaultHttpClient();

			HttpPost httppost = new HttpPost(serviceUrl + "/login/token.php");

			List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
			nameValuePairs.add(new BasicNameValuePair("username", jsObj
					.get("username").toString()));
			nameValuePairs.add(new BasicNameValuePair("password", jsObj
					.get("password").toString()));
			nameValuePairs.add(new BasicNameValuePair("service",serviceName));
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
				Log.d("Moodle", jsonStr.toString());
				JSONObject jsonObj = new JSONObject(jsonStr.toString());
				return (String) jsonObj.get("token");
			}
		} catch (Exception e) {
			Log.e("EliademyUtils", "exception", e);
			return null;
		}
		return null;
	}
}
