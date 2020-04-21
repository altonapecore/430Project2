"use strict";

var handleSubmission = function handleSubmission(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#siteName").val() == '') {
    return false;
  }

  if (!validateUrl($("#siteName").val())) {
    return false;
  }

  sendAjax('POST', $("#siteForm").attr("action"), $("#siteForm").serialize(), function () {
    siteSuccess($("#siteName"));
  });
  return false;
};

var SiteForm = function SiteForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "siteForm",
      onSubmit: handleSubmission,
      name: "siteForm",
      action: "/maker",
      method: "POST",
      className: "siteForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Site Name: "), /*#__PURE__*/React.createElement("input", {
      id: "siteName",
      type: "text",
      name: "siteName",
      placeholder: "Site Name"
    }), /*#__PURE__*/React.createElement("select", {
      "class": "rounded",
      id: "tag",
      name: "tag",
      form: "siteForm"
    }, /*#__PURE__*/React.createElement("option", {
      value: "funny"
    }, "funny"), /*#__PURE__*/React.createElement("option", {
      value: "weird"
    }, "weird"), /*#__PURE__*/React.createElement("option", {
      value: "science"
    }, "science"), /*#__PURE__*/React.createElement("option", {
      value: "computers"
    }, "computers")), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeSiteSubmit",
      type: "submit",
      value: "Submit Site"
    }))
  );
};

var SiteList = function SiteList(props) {
  if (props.sites.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "siteList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "noSites"
      }, "No Sites Yet"))
    );
  }

  var siteNodes = props.sites.map(function (site) {
    return (/*#__PURE__*/React.createElement("div", {
        "class": "card",
        style: "width: 34rem;"
      }, /*#__PURE__*/React.createElement("div", {
        "class": "card-body"
      }, /*#__PURE__*/React.createElement("a", {
        href: site.siteName,
        "class": "btn btn-primary",
        target: "_blank"
      }, site.siteName)))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "siteList"
    }, siteNodes)
  );
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SiteForm, {
    csrf: csrf
  }), document.querySelector("#makeSite"));
  ReactDOM.render( /*#__PURE__*/React.createElement("h3", null, "This part is in progress, sorry"), document.querySelector("#sites"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
}; // Regular expression to see if a url is valid or not


function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}
