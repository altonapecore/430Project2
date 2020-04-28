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
    const handleLogin = (e) => {
        e.preventDefault();
    
        $("#error").animate({width:'hide'},350);
    
    
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
    
        $("#error").animate({width:'hide'},350);
    
    
        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == ''){
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
                <input className="formSubmit" type="submit" value="Sign In" />
            </form>
        );
    };
    
    const SignupWindow = (props) => {
        return(
            <form 
                id="signupForm"
                name="signupForm"
                onSubmit={handleSignup}
                action="/signup"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username"/>
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password"/>
                <label htmlFor="pass2">Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Sign Up" />
            </form>
        );
    };
    
    
    
    const createLoginWindow = (csrf) => {
        ReactDOM.render(
            <LoginWindow csrf={csrf} />,
            document.querySelector("#content")
        );
    
    };
    
    const createSignupWindow = (csrf) => {
        ReactDOM.render(
            <SignupWindow csrf={csrf} />,
            document.querySelector("#content")
        );
    };
    
    const setup = (csrf) => {
        const loginButton = document.querySelector("#loginButton");
        const signupButton = document.querySelector("#signupButton");
    
    
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
    
        createLoginWindow(csrf); // Default view
    };
    
    
    
    const getToken = () => {
        sendAjax('GET', '/getToken', null, (result) => {
            setup(result.csrfToken);
        });
    };
    
    $(document).ready(function() {
        getToken();
    });
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
            <input id="pass" type="text" name="pass" placeholder="password"/>
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
            metho="POST"
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
    )
}

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");


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