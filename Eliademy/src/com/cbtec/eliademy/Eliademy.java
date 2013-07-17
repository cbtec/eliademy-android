/**
 * Eliademy
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

package com.cbtec.eliademy;

import android.app.Dialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.IBinder;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import org.apache.cordova.*;

import com.android.vending.billing.IInAppBillingService;
import com.google.analytics.tracking.android.EasyTracker;


public class Eliademy extends DroidGap
{
	public static IInAppBillingService sBillingService = null;
	public static Eliademy sInstance = null;

	ServiceConnection mBillingServiceConn = new ServiceConnection()
	{
	   @Override
	   public void onServiceDisconnected(ComponentName name)
	   {
	       sBillingService = null;
	   }

	   @Override
	   public void onServiceConnected(ComponentName name, IBinder service)
	   {
	       sBillingService = IInAppBillingService.Stub.asInterface(service);
	   }
	};

	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		sInstance = this;
		
		super.onCreate(savedInstanceState);
		super.loadUrl(Config.getStartUrl(), 10000);

		bindService(new Intent("com.android.vending.billing.InAppBillingService.BIND"), mBillingServiceConn, Context.BIND_AUTO_CREATE);

		// Rate app dialog, mostly taken from here:
		// http://www.androidsnippets.com/prompt-engaged-users-to-rate-your-app-in-the-android-market-appirater
        
		final Context context = getContext();
		
		final SharedPreferences prefs = context.getSharedPreferences("apprater", 0);
                
		if (prefs.getBoolean("dontshowagain", false)) { return ; }

        final SharedPreferences.Editor editor = prefs.edit();

        // Get date of first launch
        Long date_firstLaunch = prefs.getLong("date_firstlaunch", 0);

        if (date_firstLaunch == 0)
        {
            date_firstLaunch = System.currentTimeMillis();
            editor.putLong("date_firstlaunch", date_firstLaunch);
        }
        
        // Wait at least 7 days before opening
        if (System.currentTimeMillis() >= date_firstLaunch + 604800000)
        {
        	final Dialog dialog = new Dialog(context);
            dialog.setTitle("Rate " + getString(R.string.app_name));

            LinearLayout ll = new LinearLayout(context);
            ll.setOrientation(LinearLayout.VERTICAL);
            
            TextView tv = new TextView(context);
            tv.setText("If you enjoy using " + getString(R.string.app_name) + ", please take a moment to rate it. Thanks for your support!");
            tv.setWidth(240);
            tv.setPadding(4, 0, 4, 10);
            ll.addView(tv);

            Button b1 = new Button(context);
            b1.setText("Rate " + getString(R.string.app_name));
            b1.setOnClickListener(new OnClickListener() {
                public void onClick(View v)
                {
                    context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.cbtec.eliademy")));
                    editor.putBoolean("dontshowagain", true);
                    editor.commit();
                    dialog.dismiss();
                }
            });        
            ll.addView(b1);

            Button b2 = new Button(context);
            b2.setText("Remind me later");
            b2.setOnClickListener(new OnClickListener() {
                public void onClick(View v)
                {
                	editor.putLong("date_firstlaunch", System.currentTimeMillis());
                	dialog.dismiss();
                }
            });
            ll.addView(b2);

            Button b3 = new Button(context);
            b3.setText("No, thanks");
            b3.setOnClickListener(new OnClickListener() {
                public void onClick(View v)
                {
                    editor.putBoolean("dontshowagain", true);
                    editor.commit();
                    dialog.dismiss();
                }
            });
            ll.addView(b3);

            dialog.setContentView(ll);        
            dialog.show();        
        }
        
        editor.commit();
	}
	
	@Override
	public void onDestroy()
	{
		super.onDestroy();

		if (mBillingServiceConn != null)
		{
	        unbindService(mBillingServiceConn);
	    }
	}

	@Override
	protected void onStart()
	{
		super.onStart();
		
		EasyTracker.getInstance().activityStart(this);
	}

	@Override
	protected void onStop()
	{
		super.onStop();

		EasyTracker.getInstance().activityStop(this);
	}
}
