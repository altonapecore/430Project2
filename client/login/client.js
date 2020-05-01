import React from 'react';
import ReactDOM from 'react-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const handleLogin = (e) => {
    e.preventDefault();

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

const handleSignup = (e) => {
    e.preventDefault();
    
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const handleTag = (e) => {
    e.preventDefault();

    sendAjax('POST', $("#tagForm").attr("action"), $("#tagForm").serialize(), (data) => {
        ReactDOM.render(
            <SiteList sites={data.sites} />, document.querySelector("#sites")
        );
    });
};

const LoginWindow = (props) => {
    return(
        <form 
            id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign in"/>
        </form>
    );
};

const SignupWindow = (props) => {
    return(
        <form
            id="signupForm" name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="text" name="pass" placeholder="password"/>
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign in"/>
        </form>
    );
};

const TagWindow = (props) => {
    return(
        <form
            id="tagForm"
            name="tagForm"
            onSubmit={handleTag}
            action="/getByTag"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="tag">Tag</label>
            <select className="rounded" id="tag" name="tag">
                <option value="funny">funny</option>
                <option value="weird">weird</option>
                <option value="science">science</option>
                <option value="computers">computers</option>
            </select>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Get Sites"/>
        </form>
    );
};

// Custom element where each site is displayed on a card
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
                        <Button className="CardText" href={site.siteName} target="_blank">{site.siteName}</Button>
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

const getSites = (csrf) => {
    sendAjax('GET', '/getAllSites', null, (data) => {
        ReactDOM.render(
            <LoginWindow csrf={csrf} />,
            document.querySelector("#content")
        );
        ReactDOM.render(
            <SiteList sites={data.sites} />, document.querySelector("#sites")
        );
    });
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    ReactDOM.render(
        <SiteList sites={[]} />, document.querySelector("#sites")
    );

    getSites();
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const getRandomSite = (csrf) => {
    sendAjax('GET', '/getSite', null, (data) => {
        ReactDOM.render(
            <LoginWindow csrf={csrf} />,
            document.querySelector("#content")
        );
        ReactDOM.render(
            <SiteList sites={data.sites} />, document.querySelector("#sites")
        );
    });
};

const createTagWindow = (csrf) => {
    ReactDOM.render(
        <TagWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// Get references to the buttons and add listeners
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    const randomSiteButton = document.querySelector("#randomSiteButton");
    const allSitesButton = document.querySelector("#allSitesButton");
    const findByTagButton = document.querySelector("#findByTagButton");


    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    randomSiteButton.addEventListener("click", (e) => {
        e.preventDefault();
        getRandomSite(csrf);
        return false;
    });

    allSitesButton.addEventListener("click", (e) => {
        e.preventDefault(csrf);
        getSites();
        return false;
    });

    findByTagButton.addEventListener("click", (e) => {
        e.preventDefault();
        createTagWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#myModal").css("display", "block");
};

const redirect = (response) => {
    window.location = response.redirect;
};

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