/**
 * Eliademy
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */
 
package com.cbtec.lmsservice;

interface LmsService {

    /**
	 * This is the first method that gets called from the service. 
	 * Its expected that the service initializes itself and returns
	 * appropriate result back .
	 * @param data 
	 *            The data  is the text representation for the JSONArray
	              
	 * @return Return true if initialization success else false.
	 */
    boolean initializeService(String data);
    
    /**
	 * This is the last method that gets called from the service. 
	 * Its expected that the service deinitializes itself and returns
	 * appropriate result back. (e.g Logs out from server , closes any sessions
	 * etc )
	 * @param data
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Return true if de-initialization success else false.
	 */
	boolean deInitializeService(String data);
	
	/**
	 * This method is called to fetch the assignments related information from the  
	 * service. 
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Text representation of the server json response. The server json response should match
	 * this 
	 
		General structure
		
		object {
		courses   //list of courses containing assignments
		list of ( 
		  //course information object
		object {
		id int   //course id
		fullname string   //course full name
		shortname string   //course short name
		code string   //course code
		timemodified int   //last time modified
		completed int   //completed
		quizes   //list of quiz information
		list of ( 
		  //quiz information object
		object {
		id int   //assignment id
		instanceid int   //assignment instance id
		course int   //course id
		name string   //assignment name
		visible int   //Visibility info
		nosubmissions int   //no submissions
		submissiondrafts int   //submissions drafts
		sendnotifications int   //send notifications
		sendlatenotifications int   //send notifications
		duedate int   //assignment due date
		allowsubmissionsfromdate int   //allow submissions from date
		grade int   //grade type
		grades   //grade information
		list of ( 
		  //grade information object
		object {
		grade string  Optional //Grade scored
		grademax string  Optional //Max grade for assignment
		gradestring string  Optional //string for grade
		feedback string  Optional //feedback
		dategraded int  Optional //date the submission was graded
		} 
		)timemodified int   //last time assignment was modified
		configs   //list of configuration settings
		list of ( 
		  //assignment configuration object
		object {
		id int   //assign_plugin_config id
		assignment int   //assignment id
		plugin string   //plugin
		subtype string   //subtype
		name string   //name
		value string   //value
		} 
		)canedit int   //can user edit this quiz
		submitcount int  Optional //submissions count
		haveSubmissions int   //user has submitted something
		score string  Optional //quiz score
		} 
		)assignments   //list of assignment information
		list of ( 
		  //assignment information object
		object {
		id int   //assignment id
		course int   //course id
		instanceid int   //assignment instance id
		intro string   //Intro to assignment
		introformat int   //Intro format
		name string   //assignment name
		visible int   //Visibility info
		nosubmissions int   //no submissions
		submissiondrafts int   //submissions drafts
		sendnotifications int   //send notifications
		sendlatenotifications int   //send notifications
		duedate int   //assignment due date
		allowsubmissionsfromdate int   //allow submissions from date
		preventlatesubmissions int   //prevent late submissions
		latesubmissionsuntil int   //late submissions until days
		grade int   //grade type
		timemodified int   //last time assignment was modified
		configs   //list of configuration settings
		list of ( 
		  //assignment configuration object
		object {
		id int   //assign_plugin_config id
		assignment int   //assignment id
		plugin string   //plugin
		subtype string   //subtype
		name string   //name
		value string   //value
		} 
		)fileinfo   //list of file attachments to assignments
		list of ( 
		  //file information object
		object {
		id int   //file id
		name string   //name
		filename string  Optional //file name
		timecreated int   //time created
		url string   //url for the file
		convertedpath string   //url for the converted file
		contextualdata string   //contextual data
		filetype string  Optional //file type
		options string  Optional //file attachment options
		} 
		)grades   //grade information
		list of ( 
		  //grade information object
		object {
		grade string  Optional //Grade scored
		grademax string  Optional //Max grade for assignment
		gradestring string  Optional //string for grade
		feedback string  Optional //feedback
		dategraded int  Optional //date the submission was graded
		} 
		)canedit int   //can user edit this task
		submitcount int  Optional //submissions count
		haveSubmissions int   //user has submitted something
		section_visible int   //visibility of the section this task belongs to
		} 
		)coursebackground string   //course background picture
		inviteurl string   //public invitation url for self enrollment
		invitesopen int   //public invitation url status
		invitecode string   //public invitation code
		canedit int   //can user edit course, 1 for yes
		students int  Optional //students count in course
		categoryid int   //category id
		published_in_catalog int  Default to "0" //course published in catalog
		course_logo string  Optional //course logo image
		} 
		)warnings  Optional //list of warnings
		list of ( 
		  //warning
		object {
		item string  Optional //item
		itemid int  Optional //item id
		warningcode string   //the warning code can be used by the client app to implement specific behaviour
		message string   //untranslated english message to explain the warning
		} 
		)} 
	 *
	 */
	String eliademyGetAssignments(String data);

   /**
	 * This method is called to fetch the course contents information from the  
	 * service. 
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Text representation of the server json response. The server json response should match
	 * this
		 General structure

		list of ( 
		object {
		id int   //Section ID
		name string   //Section name
		visible int  Optional //is the section visible
		summary string   //Section description
		summaryformat int   //summary format (1 = HTML, 0 = MOODLE, 2 = PLAIN or 4 = MARKDOWN)
		modules   //list of module
		list of ( 
		object {
		id int   //activity id
		url string  Optional //activity url
		name string   //activity module name
		description string  Optional //activity description
		visible int  Optional //is the module visible
		modicon string   //activity icon url
		modname string   //activity module type
		modplural string   //activity module plural name
		availablefrom int  Optional //module availability start date
		availableuntil int  Optional //module availability en date
		indent int   //number of identation in the site
		contents list of ( 
		object {
		type string   //a file or a folder or external link
		filename string   //filename
		name string  Optional //name
		filepath string   //filepath
		filesize int   //filesize
		fileurl string  Optional //downloadable file url
		fileid int  Optional //file id
		convertedpath string  Optional //converted pdf url
		contextualdata string  Optional //contextual data for the resource
		content string  Optional //Raw content, will be used when type is content
		timecreated int   //Time created
		timemodified int   //Time modified
		sortorder int   //Content sort order
		userid int   //User who added this content to moodle
		author string   //Content owner
		license string   //Content license
		mimetype string  Optional //Mimetype
		} 
		)} 
		)} 
		) 
	 *
	 */
	String eliademyGetCourseContents(String data); 

   /**
	 * This method is called to fetch the enrolled users of the course from the  
	 * service. 
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Text representation of the server json response. The server json response should match
	 * this 
		General structure
		
		list of ( 
		object {
		id double   //ID of the user
		username string  Optional //Username policy is defined in Moodle security config
		firstname string  Optional //The first name(s) of the user
		lastname string  Optional //The family name of the user
		fullname string   //The fullname of the user
		email string  Optional //An email address - allow email as root@localhost
		address string  Optional //Postal address
		phone1 string  Optional //Phone 1
		phone2 string  Optional //Phone 2
		icq string  Optional //icq number
		skype string  Optional //skype id
		yahoo string  Optional //yahoo id
		aim string  Optional //aim id
		msn string  Optional //msn number
		department string  Optional //department
		institution string  Optional //institution
		idnumber string  Optional //An arbitrary ID code number perhaps from the institution
		interests string  Optional //user interests (separated by commas)
		firstaccess int  Optional //first access to the site (0 if never)
		lastaccess int  Optional //last access to the site (0 if never)
		description string  Optional //User profile description
		descriptionformat int  Optional //description format (1 = HTML, 0 = MOODLE, 2 = PLAIN or 4 = MARKDOWN)
		city string  Optional //Home city of the user
		url string  Optional //URL of the user
		country string  Optional //Home country code of the user, such as AU or CZ
		profileimageurlsmall string  Optional //User image profile URL - small version
		profileimageurl string  Optional //User image profile URL - big version
		customfields  Optional //User custom fields (also known as user profil fields)
		list of ( 
		object {
		type string   //The type of the custom field - text field, checkbox...
		value string   //The value of the custom field
		name string   //The name of the custom field
		shortname string   //The shortname of the custom field - to be able to build the field class in the code
		} 
		)groups  Optional //user groups
		list of ( 
		object {
		id int   //group id
		name string   //group name
		description string   //group description
		descriptionformat int   //description format (1 = HTML, 0 = MOODLE, 2 = PLAIN or 4 = MARKDOWN)
		} 
		)roles  Optional //user roles
		list of ( 
		object {
		roleid int   //role id
		name string   //role name
		shortname string   //role shortname
		sortorder int   //role sortorder
		} 
		)preferences  Optional //User preferences
		list of ( 
		object {
		name string   //The name of the preferences
		value string   //The value of the custom field
		} 
		)enrolledcourses  Optional //Courses where the user is enrolled - limited by which courses the user is able to see
		list of ( 
		object {
		id int   //Id of the course
		fullname string   //Fullname of the course
		shortname string   //Shortname of the course
		} 
		)} 
		)
	 *	 
	 */
	String eliademyGetEnrolledUsers(String data);
	
   /**
	 * This method is called to fetch the users courses related information from the  
	 * service. 
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Text representation of the server json response. The server json response should match
	 * this 
 
		General structure
		
		object {
		courses   //list of courses containing assignments
		list of ( 
		  //course information object
		object {
		id int   //course id
		fullname string   //course full name
		shortname string   //course short name
		code string   //course code
		timemodified int   //last time modified
		completed int   //completed
		quizes   //list of quiz information
		list of ( 
		  //quiz information object
		object {
		id int   //assignment id
		instanceid int   //assignment instance id
		course int   //course id
		name string   //assignment name
		visible int   //Visibility info
		nosubmissions int   //no submissions
		submissiondrafts int   //submissions drafts
		sendnotifications int   //send notifications
		sendlatenotifications int   //send notifications
		duedate int   //assignment due date
		allowsubmissionsfromdate int   //allow submissions from date
		grade int   //grade type
		grades   //grade information
		list of ( 
		  //grade information object
		object {
		grade string  Optional //Grade scored
		grademax string  Optional //Max grade for assignment
		gradestring string  Optional //string for grade
		feedback string  Optional //feedback
		dategraded int  Optional //date the submission was graded
		} 
		)timemodified int   //last time assignment was modified
		configs   //list of configuration settings
		list of ( 
		  //assignment configuration object
		object {
		id int   //assign_plugin_config id
		assignment int   //assignment id
		plugin string   //plugin
		subtype string   //subtype
		name string   //name
		value string   //value
		} 
		)canedit int   //can user edit this quiz
		submitcount int  Optional //submissions count
		haveSubmissions int   //user has submitted something
		score string  Optional //quiz score
		} 
		)assignments   //list of assignment information
		list of ( 
		  //assignment information object
		object {
		id int   //assignment id
		course int   //course id
		instanceid int   //assignment instance id
		intro string   //Intro to assignment
		introformat int   //Intro format
		name string   //assignment name
		visible int   //Visibility info
		nosubmissions int   //no submissions
		submissiondrafts int   //submissions drafts
		sendnotifications int   //send notifications
		sendlatenotifications int   //send notifications
		duedate int   //assignment due date
		allowsubmissionsfromdate int   //allow submissions from date
		preventlatesubmissions int   //prevent late submissions
		latesubmissionsuntil int   //late submissions until days
		grade int   //grade type
		timemodified int   //last time assignment was modified
		configs   //list of configuration settings
		list of ( 
		  //assignment configuration object
		object {
		id int   //assign_plugin_config id
		assignment int   //assignment id
		plugin string   //plugin
		subtype string   //subtype
		name string   //name
		value string   //value
		} 
		)fileinfo   //list of file attachments to assignments
		list of ( 
		  //file information object
		object {
		id int   //file id
		name string   //name
		filename string  Optional //file name
		timecreated int   //time created
		url string   //url for the file
		convertedpath string   //url for the converted file
		contextualdata string   //contextual data
		filetype string  Optional //file type
		options string  Optional //file attachment options
		} 
		)grades   //grade information
		list of ( 
		  //grade information object
		object {
		grade string  Optional //Grade scored
		grademax string  Optional //Max grade for assignment
		gradestring string  Optional //string for grade
		feedback string  Optional //feedback
		dategraded int  Optional //date the submission was graded
		} 
		)canedit int   //can user edit this task
		submitcount int  Optional //submissions count
		haveSubmissions int   //user has submitted something
		section_visible int   //visibility of the section this task belongs to
		} 
		)coursebackground string   //course background picture
		inviteurl string   //public invitation url for self enrollment
		invitesopen int   //public invitation url status
		invitecode string   //public invitation code
		canedit int   //can user edit course, 1 for yes
		students int  Optional //students count in course
		categoryid int   //category id
		published_in_catalog int  Default to "0" //course published in catalog
		course_logo string  Optional //course logo image
		} 
		)warnings  Optional //list of warnings
		list of ( 
		  //warning
		object {
		item string  Optional //item
		itemid int  Optional //item id
		warningcode string   //the warning code can be used by the client app to implement specific behaviour
		message string   //untranslated english message to explain the warning
		} 
		)} 
	 *
	 */	
	 
	String eliademyGetUsersCourses(String data);
	
   /**
	 * This method is called to fetch the user related information from the  
	 * service. 
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Text representation of the server json response. The server json response should match
	 * this
	    General structure

		list of ( 
		object {
		id double   //ID of the user
		username string  Optional //Username policy is defined in Moodle security config
		firstname string  Optional //The first name(s) of the user
		lastname string  Optional //The family name of the user
		fullname string   //The fullname of the user
		email string  Optional //An email address - allow email as root@localhost
		address string  Optional //Postal address
		phone1 string  Optional //Phone 1
		phone2 string  Optional //Phone 2
		icq string  Optional //icq number
		skype string  Optional //skype id
		yahoo string  Optional //yahoo id
		aim string  Optional //aim id
		msn string  Optional //msn number
		department string  Optional //department
		institution string  Optional //institution
		interests string  Optional //user interests (separated by commas)
		firstaccess int  Optional //first access to the site (0 if never)
		lastaccess int  Optional //last access to the site (0 if never)
		auth string  Optional //Auth plugins include manual, ldap, imap, etc
		confirmed double  Optional //Active user: 1 if confirmed, 0 otherwise
		idnumber string  Optional //An arbitrary ID code number perhaps from the institution
		lang string  Optional //Language code such as "en", must exist on server
		theme string  Optional //Theme name such as "standard", must exist on server
		timezone string  Optional //Timezone code such as Australia/Perth, or 99 for default
		mailformat int  Optional //Mail format code is 0 for plain text, 1 for HTML etc
		description string  Optional //User profile description
		descriptionformat int  Optional //description format (1 = HTML, 0 = MOODLE, 2 = PLAIN or 4 = MARKDOWN)
		city string  Optional //Home city of the user
		url string  Optional //URL of the user
		country string  Optional //Home country code of the user, such as AU or CZ
		profileimageurlsmall string   //User image profile URL - small version
		profileimageurl string   //User image profile URL - big version
		customfields  Optional //User custom fields (also known as user profil fields)
		list of ( 
		object {
		type string   //The type of the custom field - text field, checkbox...
		value string   //The value of the custom field
		name string   //The name of the custom field
		shortname string   //The shortname of the custom field - to be able to build the field class in the code
		} 
		)preferences  Optional //User preferences
		list of ( 
		object {
		name string   //The name of the preferences
		value string   //The value of the custom field
		} 
		)enrolledcourses  Optional //Courses where the user is enrolled - limited by which courses the user is able to see
		list of ( 
		object {
		id int   //Id of the course
		fullname string   //Fullname of the course
		shortname string   //Shortname of the course
		} 
		)} 
		)
	 *
	 */
	String eliademyGetUserInformation(String data);

   /**
	 * This method is called to fetch the site related information from the  
	 * service. 
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Text representation of the server json response. The server json response should match
	 * this
	 
	 	General structure

		object {
		sitename string   //site name
		username string   //username
		firstname string   //first name
		lastname string   //last name
		fullname string   //user full name
		userid int   //user id
		siteurl string   //site url
		userpictureurl string   //the user profile picture.
		                    Warning: this url is the public URL that only works when forcelogin is set to NO and guestaccess is set to YES.
		                    In order to retrieve user profile pictures independently of the Moodle config, replace "pluginfile.php" by
		                    "webservice/pluginfile.php?token=WSTOKEN&file=". Of course the user can only see profile picture depending on his/her permissions.
		                    Moreover it is recommended to use HTTPS too.
		functions list of ( 
		  //functions that are available
		object {
		name string   //function name
		version double   //The version number of moodle site/local plugin linked to the function
		} 
		)downloadfiles int  Optional //1 if users are allowed to download files, 0 if not
		}  
		
	 *
	 */
	 
    String eliademyGetSiteInformation(String data);
    
   /**
	 * This method is called to fetch the webservice token, the token is used in webservices calls and in some cases
	 * to fetch files from the server
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return The web service token.
	 * this 
	 */
	String eliademyGetWebServiceToken();
	
   /**
     * Currently works with for Eliademy Service only.
	 * This method is called to fetch the users forums related information from the  
	 * service. 
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Text representation of the server json response. The server json response should match
	 * this 
	 */
	String eliademyGetUserForums(String data);
	
   /**
     * Currently works with for Eliademy Service only.
     * 
	 * This method is called to fetch the assignments related information from the  
	 * service. 
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Text representation of the server json response. The server json response should match
	 * this 
	 */
	String eliademyExecWebService(String service,String data);
	
   /**
     * Currently works with for Eliademy Service only.
     *
	 * This method is called to register the device for push notifications from the service
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Return true if initialization success else false.
	 *
	 */
	boolean registerPushNotifications(String data);
	
   /**
     * Currently works with for Eliademy Service only.
     *
	 * This method is called to unregister the device for push notifications  
	 *
	 * @param data 
	 *            The data  is the text representation for the JSONArray.
	 
	 * @return Return true if initialization success else false.
	 * 
	 */
	boolean unregisterPushNotifications(String data);
}
