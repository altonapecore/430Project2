const handleSubmission = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#siteName").val() == ''){
        return false;
    }

    if(!validateUrl($("#siteName").val())){
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
            <input id="siteName" type="text" name="siteName" placeholder="Site Name"/>
            <select class="rounded" id="tag" name="tag" form="siteForm">
                <option value="funny">funny</option>
                <option value="weird">weird</option>
                <option value="science">science</option>
                <option value="computers">computers</option>
            </select>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeSiteSubmit" type="submit" value="Submit Site" />
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
        return(
            <div class="card" style="width: 34rem;">
                <div class="card-body">
                    <a href={site.siteName} class="btn btn-primary" target="_blank">{site.siteName}</a>
                </div>
            </div>
        );
    });

    return(
        <div className="siteList">
            {siteNodes}
        </div>
    );
};

const setup = function(csrf){
    ReactDOM.render(
        <SiteForm csrf={csrf} />, document.querySelector("#makeSite")
    );

    ReactDOM.render(
        <h3>This part is in progress, sorry</h3>, document.querySelector("#sites")
    );
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});