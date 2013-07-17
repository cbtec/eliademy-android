/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(
        [ "app/tools/utils" ],
        function(Utils) {
            return {
                root : {
                    // TODO: site config.
                    site_name : "Eliademy",
                    dashboard: "Dashboard",
                    // General
                    edit_profile : "Edit profile",
                    settings : "Settings",
                    logout : "Logout",
                    add : "Add",
                    errors : "Errors!",

                    add_instructions : "Add instructions",
                    calendar : "Calendar",
                    completed_courses : "Completed courses",
                    courses : "Courses",
                    edit : "Edit",
                    feed : "Feed",
                    forum : "Discussion",
                    instructions : "Instructions",
                    no_due_date : "No due date",
                    ongoing_courses : "Ongoing courses",
                    overview : "Course content",
                    participants : "Participants",
                    tasks : "Tasks",
                    grades : "Grades",
                    new_forum : "New forum",
                    new_youtube: "Youtube",
                    new_slideshare: "Slideshare",
                    new_vimeo: "Vimeo",
                    msg_youtube1: "Please copy YouTube URL from address field of your browser and paste it here.",
                    msg_youtube2: "Link should look like http://www.youtube.com/watch?123 or http://youtu.be/123",
                    
                    msg_vimeo1: "Please copy Vimeo URL from address field of your browser and paste it here.",    
                    msg_vimeo2: "Link should look like http://vimeo.com/123",    
                    msg_slideshare1: "Please copy SlideShare URL from address field of your browser and paste it here.",
                    msg_slideshare2: "Link should look like http://www.slideshare.net/title",

                    err_link:"Sorry, link seems to be wrong. Please check typing.",
                    click_pucture_to_add_link : "Click picture to add link",
                    add_link : "Add link:",
                    you_can_move_box : "You can also move the box around.",
                    email : "Email",
                    change_picture : "Change Picture",
                    change_password : "Change Password",
                    change_language : "Language",
                    upload_new_file : "Upload new file",
                    use_facebook_picture : "Use Facebook profile picture",
                    username_prompt : "Name Surname",
                    skype : "Skype ID",
                    city : "City",
                    birthday : "Birthday",
                    interests : "Interests",
                    change_deadline : "Change due date",
                    returned_tasks : "Returned tasks",
                    publish : "Publish",
                    "export" : "Export",
                    add_grade_for_other_task : "Add grade for other task",
                    not_graded_tasks : "Not graded tasks",
                    graded_tasks : "Graded tasks",
                    invalid_login : "Invalid login, please try again",
                    browser_warning1 : "You are using an unsupported browser.",
                    browser_warning2 : "You are using an unsupported browser version. Fully supported browsers are the latest versions of Chrome, Firefox or Safari.",
                    tasks_to_be_done : "Tasks to be done",
                    completed_tasks : "Completed tasks",
                    notes : "Notes",
                    course : "Course",
                    there_are_no_completed_tasks : "There are no completed tasks",
                    there_are_no_tasks : "There are no tasks",
                    there_are_no_graded_tasks: "There are no graded tasks",
                    there_are_no_ungraded_tasks: "There are no ungraded tasks",
                    submitted : "Submitted",
                    waiting_for_grade : "Waiting for grade",
                    task : "Task",
                    sign_up : "No account? Sign up",
                    fill_missing_fields : "Please fill out the missing fields.",
                    err_uploaded_file_exceeds_limit : "Unable to upload file: Uploaded file exceeds %sMB file limit",
                    clear_all_notifications : "Clear all",
                    home : "Home",
                    about : "About Us",
                    helpdesk : "Support",
                    contact : "Contact",
                    tos : "Terms Of Use",
                    privacy: "Privacy Policy",
                    blog : "Blog",
                    follow_us : "Follow us on ",
                    course_fname_limit: "Course name exceeds 120 characters limit",
                    course_sname_limit: "Course short name exceeds 40 characters limit",

                    // Task
                    file_submissions : "File submissions",
                    add_file : "Add file",
                    add_another_file : "Add another file",
                    update_file : "Update file",
                    delete_task: "Delete task",
                    delete_task_message: "All the information related to this task will be deleted. Are you sure that you want to delete this task?",
                    task_submissions: "Submission",
                    task_submit_title: "Submit task",
                    task_save_draft: "Save as draft",
                    task_instructions: "Write here or upload files",
                    task_options: "How this task will be completed:",
                    task_write_upload: "Written text or file upload",
                    task_quiz: "Quiz",
                    task_no_submission: "No submission required",
                    task_not_submitted: "Nothing submitted yet",
                    task_upload: "Upload file",
                    task_submit_changes: "Submit changes",
                    task_draft: "Edit draft",
                    task_text: "Written text",
                    task_cancel: "All changes will be lost. Leave without submitting task?",
                    quiz_question: "Question",
                    quiz_new_question: "+ New question",
                    quiz_select: "Select correct answers",
                    quiz_new_answer: "Add another option",
                    quiz_answer: "Answer option",
                    quiz_error_answer: "Answer options can't be empty.",
                    quiz_error_question: "Questions can't be empty.",
                    quiz_error_select: "You have to select at least one correct answer.",
                    quiz_finished: "Finished quizzes",
                    quiz_results: "correct",
                    quiz_correct: "Correct",
                    quiz_incorrect: "Incorrect",
                    quiz_correct_answer: "Correct answer",

                    // General dialog heading labels
                    dialog_warning : "Warning",

                    // General button labels
                    button_ok : "OK",
                    button_back : "Back",
                    button_cancel : "Cancel",
                    button_close : "Close",
                    button_delete : "Delete",
                    button_done : "Done",
                    button_exit : "Exit",
                    button_login : "Login",
                    button_next : "Next",
                    button_no : "No",
                    button_prev : "Previous",
                    button_save2 : "Save & Publish",
                    button_save3 : "Save & Invite Students",
                    button_save : "Save",
                    button_yes : "Yes",
                    button_hide : "Hide from students",
                    button_unhidden : "Not visible to students",
                    button_scrolltotop: "Scroll to top",
                    button_discard1: "Discard course",
                    button_discard2: "Discard changes",
                    button_continue: "Continue editing",
                    button_submit: "Submit",

                    // Sign up and login

                    login_country : "Country (Optional)",
                    login_email : "Email address (This will be your username)",
                    login_forgot : "Forgot username or password",
                    login_instruction1 : "You can prefill your information using these services:",
                    login_me : "Remember me",
                    login_name2 : "Last name",
                    login_name : "First name",
                    login_new : "Start new course",
                    login_password2 : "Password again",
                    login_password : "Password",
                    login_terms2 : "Terms of Service",
                    login_terms : "I have read and accept terms of service",
                    login_uni : "University (Optional)",
                    login_username : "Username [Email]",

                    // Wizard

                    wiz_add_code : "Code or abbreviation",
                    wiz_category : "Select category",
                    wiz_create_new : "Or create new",
                    wiz_instruction : "Add short description about this course for your students. You can edit this later",
                    wiz_introduction : "Introduction",
                    wiz_new_title : "Add title to your course",
                    wiz_reuse_old : "Reuse old course",
                    wiz_select_old : "Select previously held course",
                    wiz_step1 : "1. Start new course",
                    wiz_step2 : "2. Edit content",
                    wiz_step3 : "3. Edit timetable",
                    wiz_upload : "Upload file",
                    wiz_video : "Follow video instructions and upload the file as instructed.",
                    wiz_label_title : "Title",
                    wiz_label_code : "Code",
                    wiz_label_description : "Description",
                    wiz_description : "Course description\n\nLearning objectives/outcomes\n\nResources\n\nAssessment criteria",
                    wiz_new_course: "New course",
                    wiz_course_details: "Course details",

                    // Tutorial - Course editor
                    tut_courseview_edit_button : "Press \"Edit\" in order to edit the content",
                    tut_courseview_courses_list : "List of courses",
                    tut_courseview_invite : "Invite students",
                    tut_courseedit_text : "Click on the text you want to modify",
                    tut_courseedit_addcontent : "Add content or new section",
                    tut_courseedit_savepublish : "After you have done, press \"Save & Publish\"",
                    tut_courses_notification : "Notification will be shown here",
                    tut_courses_tasks : "Courses and tasks will be listed here",
                    tut_courses_new_course : "Click to start creating new course",
                    
                    tutorial1 : "After saving this page you can invite people, add tasks and edit timetable.\nYou can also edit this page later.",
                    tutorial2 : "Create timetable for your course",
                    tutorial3 : "Edit rest of the pages and invite people to your course",

                    // Creating course

                    new_dates : "Course start and end dates",
                    new_due1 : "Set due date",
                    new_due2 : "Due date",
                    new_end : "End date",
                    new_fail1 : "Allow late submissions for:",
                    new_fail2 : "days",
                    new_file : "File",
                    new_picture : "Picture",
                    new_instruction1 : "Add lectures",
                    new_instruction2 : "Create events and they will be added to course timetable.",
                    new_page : "New page",
                    new_start : "Start date",
                    new_task1 : "Instructions",
                    new_task2 : "Returned files will be shown here",
                    new_task : "New task",
                    new_topic : "New topic",
                    new_write : "Write here.",
                    new_start_course : "Create a new course",
                    new_content : "Add content",
                    //Let's show number in letter if it's less than 6
                    numToLetter:{
                        1:'One',
                        2:'Two',
                        3:'Three',
                        4:'Four',
                        5:'Five',
                    },
                    // Enrollment

                    join_close : "Close enrollment",
                    join_closed2 : "Enrollment is now closed.",
                    join_closed : "Enrollment for this course is closed.",
                    join_email_button : "Email invitations",
                    join_email_tooltip : "Invite more participants",
                    stop_email_tooltip : "Close this enrollment",
                    join_email2 : "Send invitations",
                    join_email3 : "Already invited:",
                    join_email : "Send invitations to these email addresses:",
                    join_email_sent: "Invitation sent. Participants will be listed on this page after they have accepted invitations.",
                    join_home : "Go to home page.",
                    join_info : " \"Invitations only\" course is accessible only to students who received a special invitation link. You can send an email invitations directly from Eliademy or share the link yourself. \"Public access\" course is available for anyone to take, your course description is indexed by Google and other search engines. You can invite students via email, social media or simply by writing your course URL on the class board.",
                    join_info2 : "Each person is either a facilitator or a student in this course. Change role by selecting the profile picture.",
                    join_open : "Open enrollment",
                    join_participants : "Participants",
                    join_enrollment : "Enrollment",
                    join_verifying_code : "Verifying invitation code",
                    join_verified_code : "Verified successfully, enrolling to course",
                    join_unknown_code : "Unknown or invalid invitation code",
                    join_private: "Invitations only",
                    join_public: "Public access",
                    label_teacher : "Facilitator",
                    promote_to_teacher : "Promote to Facilitator",
                    revert_to_student : "Change to Student",
                    invitemailErr: "Oh snap! Some of addresses are invalid, please check.",
                    share_facebook: "Share on Facebook",
                    share_twitter: "Share on Twitter",
                    share_join_text: "Join a course in Eliademy:",
                    button_share:"Share",
                    button_copy:"Copy",
                    label_copied:"Copied",
                    label_link:"Link:",
                    label_attachment: "Attachment title",
                    label_finish: "Finish",
                    
                    // Editing course
                    edit_course_caption : "Edit course",
                    edit_task_caption : "Edit task",
                    edit_cancel : "Cancel editing and return without saving any changes?",
                    edit_cancel2 : "Leave without creating course? Already created content will be lost.",
                    edit_top1 : "Edit course",
                    edit_top2 : "Content",
                    edit_top3 : "Timetable",

                    // Grading

                    task_returned: function (n1, n2) {if( (n1 == n2) && n2 ) {return "(All returned)";} else {return "(" + n1 + " of " + n2 + " returned)";} },
                    task_all_returned: "(All returned)",
                    grade_publish1: "Grades not published yet",
                    grade_publish2: "Grades published",
                    task_status1: "Not graded yet",
                    task_status2: "Not returned",
                    task_status3: "Failed",
                    title_grade: "Grade",
                    task_late1: "Returned %d days late",
                    task_late2: "Returned %d hours late",
                    tasks_files: "Returned files",
                    grading_title1: "Student",
                    grading_title2: "Attendance",
                    grading_title3: "Final grade",

                    // Forum
                    tab_forum : "Discussions",
                    event_delete : "Delete event?",
                    personal_event : "Personal event",

                    // Attendance

                    check_absent : "Absent",
                    check_attendance : "Check attendance",
                    check_present : "Present",
                    replytoaddress:"support@eliademy.com",
                    replytofrom:"noreply@eliademy.com",

                    // Quiz

                    quiz_instructions: "You have only one attempt to finish this quiz",

                    // Categories
                    category : {
                        0 : "- Select Category -",
                        1 : "Art, Design & Architecture",
                        2 : "Business",
                        3 : "Engineering & IT",
                        4 : "Tourism",
                        5 : "Hospitality Management",
                        6 : "Law",
                        7 : "Education",
                        8 : "Social Sciences",
                        9 : "Medicine & Pharmacy",
                        10 : "Nature & Science",
                        11 : "Philosophy",
                        12 : "History, Culture & Religion",
                        13 : "Languages",
                        14 : "Other"
                    },

            	// Error messages
            	error_limit: "Character limit reached",
            	error_notenrolled: "Not enrolled to this course.",
            	error_unknown: "Unknown error",
                forum_attachment: "Attach file",
                text_copyright: "© CBTec 2013 | Made in Finland",
                new_forum2 : "Create forum",
		error_title : "Forum has to have a title.",
		event_new2 : "New event",
		join_catalog : "Publish in catalog",
		join_catalog2 : "Published in catalog",
		catalog_all : "%d courses",
		catalog : "Catalog",
		catalog_enrolled : "Enrolled",
		catalog_remove : "Remove from catalog",
		catalog_sort : "Sort by",
		catalog_sort1 : "Name",
		catalog_sort2 : "Newest",
		label_home : "Home",
        label_start: "Start",
		logo_change : "Change logo",
		logo_default : "Use default",
		logo_info : "Logo can be PNG, JPEG or GIF file. Max size 500kb.<br>Image will be resized to fit 180x70 pixels.",
		picture_info : "Picture can be PNG, JPEG or GIF file. Max size %sMB.",
		picture_error: "Picture can only be PNG, JPEG or GIF file",
		error_photo : "Image will be resized to fit 180x70 pixels.",
		profile_myprofile : "My Profile",
		join_private : "Invitations only",
		join_public : "Public access",
		tutorial1 : "After saving this page you can invite people, add tasks and edit timetable.You can also edit this page later.",
        	tutorial2 : "Create timetable for your course",
        	tutorial3 : "Edit rest of the pages and invite people to your course.",
               
                    // Other translations

                    n_days_late : function(n) {
                        return n == 1 ? n + " day late" : n + " days late";
                    },

                    in_days : function(n) {
                        if (n > 0) {
                            return n == 1 ? n + " day ago" : n + " days ago";
                        } else if (n < 0) {
                            n = -n;

                            return n == 1 ? n + " day" : n + " days";
                        } else {
                            return "today";
                        }
                    },

            format_time: function (time, notime)
            {
                var txt = Utils.padLeft(time.getDate(), "0", 2) + "." + Utils.padLeft(time.getMonth() + 1, "0", 2) +
                    "." + time.getFullYear();

                if (!notime)
                {
                    txt += ", " + Utils.padLeft(time.getHours(), "0", 2) + ":" + Utils.padLeft(time.getMinutes(), "0", 2);
                }

                return txt;
            },

            assignment_uploaded: function (name, link, time)
            {
                return "Assignment <a href=\"" + link + "\">" + name + "</a> was uploaded successfully at "
                    + this.format_time(time);
            }
        },
    };
});
