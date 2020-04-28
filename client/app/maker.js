import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        textAlign: "center",
    },
    tag: {

    },
});

const handleSubmission = (e) => {
    e.preventDefault();

    $("#error").animate({width:'hide'},350);

    if($("#siteName").val() == ''){
        handleError("A site URL is required");
        return false;
    }

    if(!validateUrl($("#siteName").val())){
        handleError("The site URL is invalid or too long");
        return false;
    }

    sendAjax('POST', $("#siteForm").attr("action"), $("#siteForm").serialize(), function() {
        siteSuccess($("#siteName"));
    });

    return false;
};

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

const SiteList = function(props){
    if(props.sites.length === 0){
        return(
            <div className="siteList">
                <h3 className="noSites">No Sites Yet</h3>
            </div>
        );
    }

    const siteNodes = props.sites.map(function(site){
        const classes = useStyles();
        return(
            <Card className={classes.root}>
                <CardContent>
                    <CardActions>
                        <Button href={site.siteName} color="primary">{site.siteName}</Button>
                    </CardActions>
                    <Typography className={classes.tag} color="textPrimary">
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

const siteSuccess = () => {
    sendAjax('GET', '/getUserSites', null, (data) => {
        ReactDOM.render(
            <SiteList sites={data.sites} />, document.querySelector("#sites")
        );
    });
};

const setup = function(csrf){
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

const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#error").animate({width:'toggle'},350);
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

// Regular expression to see if a url is valid or not
function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }