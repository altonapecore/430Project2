// Import a bunch of react stuff so that we can use their Card system
import React from 'react';
import ReactDOM from 'react-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Handles submission of a new site
const handleSubmission = (e) => {
    e.preventDefault();

    if($("#siteName").val() == ''){
        handleError("A site URL is required");
        return false;
    }

    if(!validateUrl($("#siteName").val())){
        handleError("The site URL is invalid or too long");
        return false;
    }

    // If the post was successful tell the user and then display their sites
    sendAjax('POST', $("#siteForm").attr("action"), $("#siteForm").serialize(), function() {
        handleSuccess("Site added successfully");
        siteSuccess($("#siteName"));
    });

    return false;
};

// Handles a request to get all the sites that have the associated tag
const handleTag = (e) => {
    e.preventDefault();

    sendAjax('POST', $("#tagForm").attr("action"), $("#tagForm").serialize(), (data) => {
        ReactDOM.render(
            <SiteList sites={data.sites} />, document.querySelector("#sites")
        );
    });
};

// Hanldes the changing of password
const handlePass = (e) => {
    e.preventDefault();

    // If successful then tell the user and then show them their sites
    sendAjax('POST', $("#passForm").attr("action"), $("#passForm").serialize(), function() {
        handleSuccess("Password successfully changed");
        siteSuccess($("#siteName"));
    });
};

// The form for making a site
const SiteForm = (props) => {
    return(
        <form 
            id="siteForm"
            onSubmit={handleSubmission}
            name="siteForm"
            action="/maker"
            method="POST"
            className="siteForm"
        >
            <label htmlFor="name">Site Name: </label>
            <input className="rounded" id="siteName" type="text" name="siteName" placeholder="Site Name"/>
            <label htmlFor="tag">Tag</label>
            <select className="rounded" id="tag" name="tag" form="siteForm">
                <option value="funny">funny</option>
                <option value="weird">weird</option>
                <option value="science">science</option>
                <option value="computers">computers</option>
            </select>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="rounded" className="makeSiteSubmit" type="submit" value="Submit Site" />
        </form>
    );
};

// The form for changing the password
const PassWindow = (props) => {
    return(
        <form 
            id="passForm" name="passForm"
            onSubmit={handlePass}
            action="/changePass"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="pass">Old Password: </label>
            <input id="pass" type="password" name="pass" placeholder="Old Password"/>
            <label htmlFor="newPass">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="New Password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Change"/>
        </form>
    )
}

// The form for getting a tag's sites
const TagWindow = (props) => {
    return(
        <form
            id="tagForm"
            name="tagForm"
            onSubmit={handleTag}
            action="/getByTag"
            method="GET"
            className="mainForm"
        >
            <label htmlFor="tag">Tag</label>
            <select className="rounded" id="tag" name="tag" form="tagForm">
                <option value="funny">funny</option>
                <option value="weird">weird</option>
                <option value="science">science</option>
                <option value="computers">computers</option>
            </select>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Get Sites"/>
        </form>
    )
};

// Custom Card element where each card is a site
const SiteList = function(props){
    if(props.sites.length === 0){
        return(
            <div className="siteList">
                <h3 className="noSites">No Sites Yet</h3>
            </div>
        );
    }

    const siteNodes = props.sites.map(function(site){
        return(
            <Card className="Card" variant="outlined">
                <CardContent>
                    <CardActions>
                        <Button style={{display: "table-cell"}} className="CardText" href={site.siteName} target="_blank">{site.siteName}</Button>
                    </CardActions>
                    <Typography className="CardTag" color="textPrimary">
                        Tag: {site.tag}
                    </Typography>
                </CardContent>
            </Card>
        )
    });

    return(
        <div className="siteList">
            {siteNodes}
        </div>
    );
};

// Sends the ajax call to get a random site and then displays that site
const getRandomSite = () => {
    sendAjax('GET', '/getSite', null, (data) => {
        ReactDOM.render(
            <SiteList sites={data.sites} />, document.querySelector("#sites")
        );
    });
};

// Displays the Tag Window
const createTagWindow = (csrf) => {
    ReactDOM.render(
        <TagWindow csrf={csrf} />,
        document.querySelector("#sites")
    );
};

// Displays the user's sites
const siteSuccess = () => {
    sendAjax('GET', '/getUserSites', null, (data) => {
        ReactDOM.render(
            <SiteList sites={data.sites} />, document.querySelector("#sites")
        );
    });
};

// Displays all the sites in the database
const getSites = () => {
    sendAjax('GET', '/getAllSites', null, (data) => {
        ReactDOM.render(
            <SiteList sites={data.sites} />, document.querySelector("#sites")
        );
    });
};

// Displays the Change Password Window
const createPassWindow = (csrf) => {
    ReactDOM.render(
        <PassWindow csrf={csrf} />,
        document.querySelector("#sites")
    );
};


// Gets references to all the buttons and adds listeners to them all
const setup = function(csrf){
    const changePassButton = document.querySelector("#changePassButton");
    const randomSiteButton = document.querySelector("#randomSiteButton");
    const allSitesButton = document.querySelector("#allSitesButton");
    const findByTagButton = document.querySelector("#findByTagButton");

    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPassWindow(csrf);
        return false;
    });

    randomSiteButton.addEventListener("click", (e) => {
        e.preventDefault();
        getRandomSite();
        return false;
    });

    allSitesButton.addEventListener("click", (e) => {
        e.preventDefault();
        getSites();
        return false;
    });

    findByTagButton.addEventListener("click", (e) => {
        e.preventDefault();
        createTagWindow(csrf);
        return false;
    });

    ReactDOM.render(
        <SiteForm csrf={csrf} />, document.querySelector("#makeSite")
    );

    ReactDOM.render(
        <SiteList sites={[]} />, document.querySelector("#sites")
    );

    siteSuccess();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

// Creates a red popup
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#myModal").css("display", "block");
    $(".modal-content").css("background-color", "#CC0000");
    $(".close").css("color", "#aaa");
    $(".modal-content").css("color", "#aaa");
};

// Creates a green popup
const handleSuccess = (message) => {
    $("#errorMessage").text(message);
    $("#myModal").css("display", "block");
    $(".modal-content").css("background-color", "#00C851");
    $(".close").css("color", "#2E2E2E");
    $(".modal-content").css("color", "#2E2E2E");
}

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

// Regular expression to see if a url is valid or not
function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }