/*
 RequireJS i18n 2.0.2 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/requirejs/i18n for details
*/
(function(){function r(b,a,l,c,m,d){a[b]&&(l.push(b),(!0===a[b]||1===a[b])&&c.push(m+b+"/"+d))}function s(b,a,l,c,m){a=c+a+"/"+m;require._fileExists(b.toUrl(a+".js"))&&l.push(a)}function t(b,a,l){for(var c in a)a.hasOwnProperty(c)&&(!b.hasOwnProperty(c)||l)?b[c]=a[c]:"object"===typeof a[c]&&t(b[c],a[c],l)}var v=/(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;define(["module"],function(b){var a=b.config?b.config():{};return{version:"2.0.1+",load:function(b,c,m,d){d=d||{};d.locale&&(a.locale=d.locale);var n=
v.exec(b),g=n[1],p=n[4],h=n[5],q=p.split("-"),k=[],u={},e,f="";n[5]?(g=n[1],b=g+h):(h=n[4],p=a.locale,p||(p=a.locale="undefined"===typeof navigator?"root":(navigator.language||navigator.userLanguage||"root").toLowerCase()),q=p.split("-"));if(d.isBuild){k.push(b);s(c,"root",k,g,h);for(e=0;e<q.length;e++)d=q[e],f+=(f?"-":"")+d,s(c,f,k,g,h);c(k,function(){m()})}else c([b],function(b){var a=[],d;r("root",b,a,k,g,h);for(e=0;e<q.length;e++)d=q[e],f+=(f?"-":"")+d,r(f,b,a,k,g,h);c(k,function(){var d,e,f;
for(d=a.length-1;-1<d&&a[d];d--){f=a[d];e=b[f];if(!0===e||1===e)e=c(g+f+"/"+h);t(u,e)}m(u)})})}}})})();
