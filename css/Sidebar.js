$(window).on("load", function () {
        if ($(".tab-box-tabs").length) {
            $('body').addClass('topbarExists');
        }

    })
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");

  if (sidebar) {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleSidebarBtn';
    toggleButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M13.4697 5.46967C13.7626 5.17678 14.2374 5.17678 14.5303 5.46967L20.5303 11.4697C20.8232 11.7626 20.8232 12.2374 20.5303 12.5303L14.5303 18.5303C14.2374 18.8232 13.7626 18.8232 13.4697 18.5303C13.1768 18.2374 13.1768 17.7626 13.4697 17.4697L18.1893 12.75H4C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H18.1893L13.4697 6.53033C13.1768 6.23744 13.1768 5.76256 13.4697 5.46967Z"
          fill="#ffffff"></path>
      </svg>
    `;

    // Optional styling
    toggleButton.style.border = "none";
    toggleButton.style.padding = "8px";
    toggleButton.style.margin = "10px";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.zIndex = "1000";

    document.body.appendChild(toggleButton); // or document.body.insertBefore(toggleButton, sidebar);

    toggleButton.addEventListener('click', () => {
      sidebar.classList.toggle('visible');
      document.body.classList.toggle('collapseSidebar');
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
    const urlPath = window.location.pathname;
    const fullUrl = window.location.href.toLowerCase();

    // Adjust form layout on specific page
    if (urlPath === '/Public/Runtime/Form.aspx') {
        const form = document.querySelector('.theme-entry .runtime-form');
        if (form) {
            form.style.width = '100%';
            form.style.marginLeft = '0';
        }
    }

    // Exit early on specific runtime page
    if (urlPath === "/Runtime/Runtime/Form.aspx") return;

    // Ensure jQuery is loaded
    if (typeof jQuery === "undefined") {
        console.error("jQuery is required for this script.");
        return;
    }

    const isArabic = fullUrl.includes("publicar");

    // Sidebar container
    const sidebar = $('<div id="sidebar" class="sidebar"></div>');

    // Logo section (empty href and src as placeholders)
    const logoContainer = $('<div class="navbarBrand"><a target="_blank"><img src="https://frontenduiux.github.io/OBB_Services/Images/OBBLogo.png" alt="Oman Broad Band"></a></div>');
    const logoLink = $('<a href="#"></a>');
    logoContainer.append(logoLink);
    sidebar.append(logoContainer);

    // Sidebar title
    sidebar.append(`<div class="sidebar-section topic">${isArabic ? "القائمة" : "MENU"}</div>`);

    var fqn = null;
        // Menu items
	
	let menuItems;
    const currentUrl = window.location.href;

$(document).ready(function () {
    setTimeout(function () {
        try {
            fqn = SourceCode.Forms.Settings.User.FQN;
            console.log("Logged-in User FQN:" + fqn);
            menuBar();
          
        } catch (e) {
            console.error("Error retrieving FQN:", e);
        }
    }, 1000);
});
// function setupNavbarRedirectBasedOnUserFQN() {
//     let isInternalUser = false;

//     $(document).ready(function () {
//         setTimeout(function () {
//             try {
//                 let fqn = SourceCode.Forms.Settings.User.FQN;
//                 console.log("Logged-in User FQN: " + fqn);

//                 // Check if user is internal (starts with "obc\")
//                 if (fqn.toLowerCase().startsWith("obc\\")) {
//                     isInternalUser = true;
//                 }

//                 menuBar();
//             } catch (e) {
//                 console.error("Error retrieving FQN:", e);
//             }
//         }, 1000);

//         // Click event for .navbar-brand
//         $('.navbar-brand').on('click', function (e) {
//             e.preventDefault(); // prevent default link behavior

//             if (isInternalUser) {
//                 window.location.href = "https://www.google.com";
//             } else {
//                 window.location.href = "https://www.facebook.com";
//             }
//         });
//     });
// }

// Call the function



function menuBar(){

    
if (currentUrl.includes("ArchivingRequest") ||  currentUrl.includes("RAP") || currentUrl.includes("Retrieval") || currentUrl.includes("ArchivingLandingForm")) {
	   menuItems = [
        { text: "Home", url: "/Runtime/Runtime/Form/ArchivingLandingForm/" },
        { text: "Tasks List", url: "/Runtime/Runtime/Form/RAPTaskListForm/" },

        { text: "Completed", url: "/Runtime/Runtime/Form/RAPCompletedForm/" },
        { text: "In Progress", url: "/Runtime/Runtime/Form/RAPInProgressForm/" },
		{ text: "Archived Requests", url: "/Runtime/Runtime/Form/RAPArchivedForm/" }
    ];
	} else if (currentUrl.includes("VRM") || currentUrl.includes("ArchivingDoc") || currentUrl.includes("NewDocCreation") || currentUrl.includes("RequestAccess") || currentUrl.includes("VitalRecordManagement")) {
		menuItems = [
        { text: "Home", url: "/Runtime/Runtime/Form/VRM.LandingForm/" },
        {
					text: "New Request", url: "", children: [
						{ text: "New Document", url: "/Runtime/Runtime/Form/NewDocCreation.SubmitForm/" },
						{ text: "Archiving Document", url: "/Runtime/Runtime/Form/ArchivingDoc.SubmitForm/" }
					]
				},
        { text: "Tasks List", url: "/Runtime/Runtime/Form/VRMTaskListForm/" },
        {
					text: "New Document", url: "", children: [
						{ text: "Completed", url: "/Runtime/Runtime/Form/VRMNewDocCompletedForm/" },
						{ text: "In Progress", url: "/Runtime/Runtime/Form/VRMNewDocInProgressForm/" }
					]
				},
        {
					text: "Archiving Document", url: "", children: [
						{ text: "Completed", url: "/Runtime/Runtime/Form/VRMArchivingCompletedForm/" },
						{ text: "In Progress", url: "/Runtime/Runtime/Form/VRMArchivingInProgressForm/" }
					]
				},
        {
					text: "Request Access", url: "", children: [
						{ text: "Completed", url: "/Runtime/Runtime/Form/VRMRequestAccessCompletedForm/" },
						{ text: "In Progress", url: "/Runtime/Runtime/Form/VRMRequestAccessInProgressForm/" }
					]
				},

        { text: "Archived Records", url: "/Runtime/Runtime/Form/VRMArchivedRecsForm/" }
    ];
	} 
    else if(currentUrl.includes("Letter")) {
                menuItems = [
        { text: "Home", url: "/Runtime/Runtime/Form/LetterLandingForm/" },
        { text: "New Request", url: "/Runtime/Runtime/Form/LetterRegistration.SubmitForm/" },
        { text: "Tasks List", url: "/Runtime/Runtime/Form/LetterTaskListForm/" },
        { text: "Completed", url: "/Runtime/Runtime/Form/LetterCompletedForm/" },
        { text: "In Progress", url: "/Runtime/Runtime/Form/LetterPendingForm/" },
        { text: "Old Data", url: "/Runtime/Runtime/Form/LetterRegistration.MainForm/"},
        { text: "Old Logs", url: "/Runtime/Runtime/Form/LetterRegistration.AuditableForm1/"}
    ];
    }
    else if (currentUrl.includes("SAWP") || currentUrl.includes("WorkPermit") || currentUrl.includes("SiteAccess") || currentUrl.includes("RegistrationRequest.ReviewForm"))
	{
        if(fqn){
            if (fqn.toLowerCase().includes("K2SQL".toLowerCase())){
            if (currentUrl.includes("SAWPExternal") || currentUrl.includes("SAWP.LandingForm") || currentUrl.includes("SAWPSiteAccess") || currentUrl.includes("SiteAccessRequest")){
                menuItems = [
                    { text: "Home", url: "/Runtime/Runtime/Form/SAWP.LandingForm/" },
                    {
                        text: "New Request", url: "", children: [
                            { text: "Site Access", url: "/Runtime/Runtime/Form/SiteAccessRequest.SubmitForm/" }					]
                    },
                    { text: "Tasks List", url: "/Runtime/Runtime/Form/SAWPExternalTaskListForm/" },
                    {
                        text: "Site Access", url: "", children: [
                            { text: "In Progress", url: "/Runtime/Runtime/Form/SAWPSiteAccessExternalInProgressForm/" },
                            { text: "Completed", url: "/Runtime/Runtime/Form/SAWPSiteAccessExternalCompletedForm/" }
                        ]
                    }
                ];
                }
            }else{
                if (currentUrl.includes("SAWPInternal") || currentUrl.includes("SAWPSiteAccess") || currentUrl.includes("SAWPWorkPermit") || currentUrl.includes("RegistrationRequest.ReviewForm") || currentUrl.includes("SiteAccessRequest") || currentUrl.includes("WorkPermit.") || currentUrl.includes("WorkPermitRequest") || currentUrl.includes("SiteAccess.MainForm")){
                menuItems = [
                    { text: "Home", url: "/Runtime/Runtime/Form/SAWPInternal.LandingForm/" },
                    { text: "Tasks List", url: "/Runtime/Runtime/Form/SAWPInternalTaskListForm/" },
                    {
                        text: "New Request", url: "", children: [
                            { text: "Site Access", url: "/Runtime/Runtime/Form/SiteAccessRequest.SubmitForm/" },
                            { text: "Work Permit", url: "/Runtime/Runtime/Form/WorkPermit.SubmitForm/" }
                        ]
                    },
                    {
                        text: "Site Access", url: "", children: [
                            { text: "In Progress", url: "/Runtime/Runtime/Form/SAWPSiteAccessInternalInProgressForm/" },
                            { text: "Completed", url: "/Runtime/Runtime/Form/SAWPSiteAccessInternalCompletedForm/" }
                        ]
                    },
                    {
                        text: "Work Permit", url: "", children: [
                            { text: "In Progress", url: "/Runtime/Runtime/Form/SAWPWorkPermitInternalInProgressForm/" },
                            { text: "Completed", url: "/Runtime/Runtime/Form/SAWPWorkPermitInternalCompletedForm/" }
                        ]
                    }
                ];		
            }}
        }else{
            if (currentUrl.includes("SAWPExternal") || currentUrl.includes("SAWP.LandingForm") || currentUrl.includes("SAWPSiteAccess")){
                menuItems = [
                    { text: "Home", url: "/Runtime/Runtime/Form/SAWP.LandingForm/" },
                    {
                        text: "New Request", url: "", children: [
                            { text: "Site Access", url: "/Runtime/Runtime/Form/SiteAccessRequest.SubmitForm/" }					]
                    },
                    { text: "Tasks List", url: "/Runtime/Runtime/Form/SAWPExternalTaskListForm/" },
                    {
                        text: "Site Access", url: "", children: [
                            { text: "In Progress", url: "/Runtime/Runtime/Form/SAWPSiteAccessExternalInProgressForm/" },
                            { text: "Completed", url: "/Runtime/Runtime/Form/SAWPSiteAccessExternalCompletedForm/" }
                        ]
                    }
                ];
                }else if (currentUrl.includes("SAWPInternal") || currentUrl.includes("SAWPSiteAccess") || currentUrl.includes("SAWPWorkPermit") || currentUrl.includes("RegistrationRequest.ReviewForm")){
                    menuItems = [
                        { text: "Home", url: "/Runtime/Runtime/Form/SAWPInternal.LandingForm/" },
                        { text: "Tasks List", url: "/Runtime/Runtime/Form/SAWPInternalTaskListForm/" },
                        {
                            text: "New Request", url: "", children: [
                                { text: "Site Access", url: "/Runtime/Runtime/Form/SiteAccessRequest.SubmitForm/" },
                                { text: "Work Permit", url: "/Runtime/Runtime/Form/WorkPermit.SubmitForm/" }
                            ]
                        },
                        {
                            text: "Site Access", url: "", children: [
                                { text: "In Progress", url: "/Runtime/Runtime/Form/SAWPSiteAccessInternalInProgressForm/" },
                                { text: "Completed", url: "/Runtime/Runtime/Form/SAWPSiteAccessInternalCompletedForm/" }
                            ]
                        },
                        {
                            text: "Work Permit", url: "", children: [
                                { text: "In Progress", url: "/Runtime/Runtime/Form/SAWPWorkPermitInternalInProgressForm/" },
                                { text: "Completed", url: "/Runtime/Runtime/Form/SAWPWorkPermitInternalCompletedForm/" }
                            ]
                        }
                    ];		
            }
        }
        
	}else if(currentUrl.includes("Visitor")) {
				menuItems = [
        { text: "Home", url: "/Runtime/Runtime/Form/VisitorLandingForm/" },
        { text: "New Request", url: "/Runtime/Runtime/Form/VisitorRegistration.SubmitForm/" },
        { text: "History", url: "/Runtime/Runtime/Form/VisitorHistory.Form/" },
		{ text: "Old Data", url: "/Runtime/Runtime/Form/VisitorRegistration.MainForm/" }
                ];
    }else if(currentUrl.includes("Feasability") || currentUrl.includes("Master+Data") || currentUrl.includes("My__task__Form") || currentUrl.includes("MyRequestForm") || currentUrl.includes("Feasibility") || currentUrl.includes("FSSP.MainForm")) {
				menuItems = [
        { text: "Home", url: "/Runtime/Runtime/Form/MyRequestForm/" },
		{ text: "New Request", url: "/Runtime/Runtime/Form/Master+Data/" },
        { text: "Tasks List", url: "/Runtime/Runtime/Form/My__task__Form/" },
        { text: "Completed", url: "/Runtime/Runtime/Form/FeasibilityCompletedRequestForm/" },
        { text: "In Progress", url: "/Runtime/Runtime/Form/FeasibilityPendingRequestForm/" },
        { text: "Old Data", url: "/Runtime/Runtime/Form/FSSP.MainForm/" }
    ];
	}else if(currentUrl.includes("Incoming") || currentUrl.includes("Outgoing") || currentUrl.includes("Outing") || currentUrl.includes("ICMS.DataDashboard") || currentUrl.includes("OCMS.DataDashboard")) {
				menuItems = [
        // { text: "Home", url: "/Runtime/Runtime/Form/IncomingRequest.AllRequestsForm/" },
		{
					text: "New Request", url: "", children: [
						{ text: "Incoming Request", url: "/Runtime/Runtime/Form/NewIncomingRequestCreation.SubmitForm/" },
						{ text: "Outgoing Request", url: "/Runtime/Runtime/Form/NewOutingRequestCreation.SubmitForm/" }
					]
		},
        {
					text: "Incoming Correspondence", url: "", children: [
						{ text: "InProgress", url: "/Runtime/Runtime/Form/IncomingRequest.InProgressRequestForm/" },
						{ text: "Closed", url: "/Runtime/Runtime/Form/IncomingRequest.ClosedRequestForm/" },
						{ text: "All Requests", url: "/Runtime/Runtime/Form/IncomingRequest.AllRequestsForm/" },
						{ text: "My Tasks", url: "/Runtime/Runtime/Form/IncomingRequest.Worklist/" },
                        { text: "Old Data", url: "/Runtime/Runtime/Form/ICMS.DataDashboard/" }

					]
		},
		{
					text: "Outgoing Correspondence", url: "", children: [
						{ text: "InProgress", url: "/Runtime/Runtime/Form/OutgoingRequest.InProgressRequestForm/" },
						{ text: "My Drafts", url: "/Runtime/Runtime/Form/OutgoingRequest.DraftRequestForm/" },
						{ text: "All Requests", url: "/Runtime/Runtime/Form/OutgoingRequest.AllRequestsForm/" },
						{ text: "My Tasks", url: "/Runtime/Runtime/Form/OutgoingRequest.WorklistForm/" },
                        { text: "Old Data", url: "/Runtime/Runtime/Form/OCMS.DataDashboard/" }
					]
		}
    ];

}
else if(currentUrl.includes("Suggestions") || currentUrl.includes("Suggestions.Form") || currentUrl.includes("AllSuggestionsForm") || currentUrl.includes("SuggestionsWorklist.Form")) {
                menuItems = [
        { text: "Home", url: "/Runtime/Runtime/Form/AllSuggestionsForm/"},
        { text: "New Request", url: "/Runtime/Runtime/Form/Suggestions.Form/"},
        { text: "Tasks List", url: "/Runtime/Runtime/Form/SuggestionsWorklist.Form/"},
    ];
    }
else{
		menuItems = [
    ];		
	}
    // Build menu
   if(menuItems){
     menuItems.forEach(item => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;

        const parentLink = $('<a>')
            .attr('href', hasChildren ? 'javascript:void(0)' : item.url)
            .addClass('sidebar-link nav-link')
            .toggleClass('has-children', hasChildren)
            .append($('<span>').text(item.text));

        const itemContainer = $('<div class="sidebar-item"></div>').append(parentLink);

        if (hasChildren) {
            const submenu = $('<div class="sidebar-submenu" style="display:none;"></div>');

            item.children.forEach(sub => {
                const subLink = $('<a>')
                    .attr('href', sub.url)
                    .addClass('sidebar-link sub-link')
                    .append($('<span>').text(sub.text));

                submenu.append(subLink);
            });

            itemContainer.append(submenu);

            parentLink.on('click', function () {
                submenu.slideToggle(200);
		$(".sidebar-link").removeClass("expanded");
                $(this).toggleClass('expanded');
            });
        }

        sidebar.append(itemContainer);
    });
   }

    // Add sidebar to body
    $('body').append(sidebar);
    $('body').addClass('sidebarVisible');
};

});














const targets = document.querySelectorAll('.grid-body-content table.grid-content-table tbody');

if (targets.length > 0) {
    targets.forEach((target) => {
        const observer = new MutationObserver(function () {
            applyGrayscaleFix();
            applyGrayscaleFix2();
            applyGrayscaleFix3();
			applyGrayscaleFix4();
        });

        observer.observe(target, { childList: true, subtree: true });
    });
}


function applyGrayscaleFix() {
    $('.grid-body-content table.grid-content-table tbody tr').each(function (index) {
        const $row = $(this);
		
		
		
        if (index === 0) {
            const lastTd = $row.find('td').last();
            const lastIcon = lastTd.find('i[id^="ID1_"]');
            if (lastIcon.length === 0) return; // Skip processing if not matching
        }
		
		
		
        const tds = $row.find('td');
        const fileTypeTd = tds.eq(2);
        const dataOptions = fileTypeTd.attr('data-options');
        if (!dataOptions) return;
        
        try {
            const parsed = JSON.parse(dataOptions);
            const fileType = (parsed.value || "").toLowerCase();

            if (fileType === 'email') {
                const img = $row.find('i[id^="ID1_"] > img');
                img.attr('style', 'filter: grayscale(1) !important; width: 20px; height: 20px; cursor: pointer;');
            }
        } catch (e) {
            console.warn("Invalid JSON in data-options:", dataOptions);
        }
    });
}



function applyGrayscaleFix2() {
    $('.grid-body-content table.grid-content-table tbody tr').each(function (index) {
        const $row = $(this);
		
		
		
        if (index === 0) {
            const lastTd = $row.find('td').last();
            const lastIcon = lastTd.find('i[id^="ActionID2_"]');
            if (lastIcon.length === 0) return; // Skip processing if not matching
        }
		
		
		
        const tds = $row.find('td');
        const fileTypeTd = tds.eq(2);
        const dataOptions = fileTypeTd.attr('data-options');
        if (!dataOptions) return;
        
        try {
            const parsed = JSON.parse(dataOptions);
            const fileType = (parsed.value || "").toLowerCase();
            
            if (fileType === 'pmo') {
                const img = $row.find('i[id^="ActionID2_"] > img');
                img.attr('style', 'filter: grayscale(1) !important; width: 20px; height: 20px; cursor: pointer;');
            }
        } catch (e) {
            console.warn("Invalid JSON in data-options:", dataOptions);
        }
    });
}


function applyGrayscaleFix3() {
    $('.grid-body-content table.grid-content-table tbody tr').each(function (index) {
        const $row = $(this);
		
		
		
		
        if (index === 0) {
            const lastTd = $row.find('td').last();
            const lastIcon = lastTd.find('i[id^="IDAction_"]');
            if (lastIcon.length === 0) return; // Skip processing if not matching
        }
		
		
        const tds = $row.find('td');
        const fileTypeTd = tds.eq(2);
        const dataOptions = fileTypeTd.attr('data-options');
        if (!dataOptions) return;
        
        try {
            const parsed = JSON.parse(dataOptions);
            const fileType = (parsed.value || "").toLowerCase();

            if (fileType === 'pmo') {
                const img = $row.find('i[id^="IDAction_"] > img');
                img.attr('style', 'filter: grayscale(1) !important; width: 20px; height: 20px; cursor: pointer;');
            }
        } catch (e) {
            console.warn("Invalid JSON in data-options:", dataOptions);
        }
    });
}


function applyGrayscaleFix4() {
    $('.grid-body-content table.grid-content-table tbody tr').each(function (index) {
        const $row = $(this);
		
		
		
		
        if (index === 0) {
            const lastTd = $row.find('td').last();
            const lastIcon = lastTd.find('i[id^="ActionID6_"]');
            if (lastIcon.length === 0) return; // Skip processing if not matching
        }
		
		
        const tds = $row.find('td');
        const fileTypeTd = tds.eq(2);
        const dataOptions = fileTypeTd.attr('data-options');
        if (!dataOptions) return;
        
        try {
            const parsed = JSON.parse(dataOptions);
            const fileType = (parsed.value || "").toLowerCase();

            if (fileType === '325') {
				
                const img = $row.find('i[id^="ActionID6_"] > img');
                img.attr('style', 'filter: grayscale(1) !important; width: 20px; height: 20px; cursor: pointer;');
            }
        } catch (e) {
            console.warn("Invalid JSON in data-options:", dataOptions);
        }
    });
}

// POC 
document.addEventListener('DOMContentLoaded', function () {
  // Loop through all td elements with data-options attribute
  document.querySelectorAll('td[data-options]').forEach(function (td) {
    let dataOptions = td.getAttribute('data-options');

    try {
      let options = JSON.parse(dataOptions);
      let value = options.value;

      if (value === "Rejected" || value === "Approved") {
        // Get the <tr> (row) this <td> belongs to
        let row = td.parentElement;

        // Find sibling <td> that has <i> with GetAction1 in onclick
        let targetTd = Array.from(row.children).find(cell => {
          let iTag = cell.querySelector('i[onclick*="GetAction1"]');
          return iTag !== null;
        });

        if (targetTd) {
          let iTag = targetTd.querySelector('i[onclick*="GetAction1"]');
          if (iTag) {
            iTag.classList.add('notClickable');
          }
        }
      }
    } catch (err) {
      console.warn("Could not parse data-options:", dataOptions);
    }
  });
});