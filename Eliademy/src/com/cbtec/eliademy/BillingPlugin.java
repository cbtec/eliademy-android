/**
 * Eliademy
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

package com.cbtec.eliademy;

import java.util.ArrayList;

import org.apache.cordova.CordovaArgs;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.os.Bundle;
import android.os.RemoteException;

import com.google.analytics.tracking.android.Log;

public class BillingPlugin extends CordovaPlugin
{
	@Override
	public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException
	{
		if (Eliademy.sBillingService == null)
		{
			Log.e("Billing service is not available/ready.");
			
			return false;
		}
		
		if (action.equals("getPurchasedItems"))
		{
			getPurchasedItems(callbackContext);
			
			return true;
		}
		else if (action.equals("orderProduct"))
		{
			orderProduct(args, callbackContext);

			return true;
		}
		
		return false;
	}

	private void orderProduct(CordovaArgs args, CallbackContext callbackContext)
	{
		//Eliademy.sBillingService.getSkuDetails(apiVersion, packageName, type, skusBundle)
		
	}

	private void getPurchasedItems(CallbackContext callbackContext)
	{
		try
	    {
			JSONArray products = new JSONArray();
			
	 	   	Bundle ownedItems = Eliademy.sBillingService.getPurchases(3, Eliademy.sInstance.getPackageName(), "inapp", null);
	 	   
	 	   	if (ownedItems.getInt("RESPONSE_CODE") == 0)
	 	   	{
	 	   		final ArrayList<String> items = ownedItems.getStringArrayList("INAPP_PURCHASE_ITEM_LIST");

	 	   		for (int i=0; i<items.size(); i++)
	 	   		{
	 	   			products.put(items.get(i));
	 	   		}
	 	   	}
	 	   
	 	   	callbackContext.success(products);
	    }
	    catch (RemoteException e)
	    {
	    	callbackContext.error(e.getMessage());
	    }		
	}	
}
