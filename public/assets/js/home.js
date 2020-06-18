const $setLogin = $('#login');
const $setSignUp = $('#signup');
const $submitButton = $('#submit')
const $emailInput = $('#email');
const $passwordInput = $('#password');
const $message = $('#message');

let authSetting = 'login';

function setAuth(setting) {
  authSetting = setting;
  
  if (authSetting === 'login') {
    $setLogin.addClass('active');
    $setSignUp.removeClass('active');
    $submitButton.text('Log in');
  } else
  {
    $setSignUp.addClass('active');
    $setLogin.removeClass('active');
    $submitButton.text('Sign up');
  }
}

function displayMessage(message, type) {
  $message.text(message).attr('class', type);
}

function handleFormSubmit(event) {
  event.preventDefault();

  let email = $emailInput.val().trim();
  let password = $passwordInput.val().trim();

  if ( !email || !password ) {
    displayMessage('Email and Password fields cannot be left blank.' , 'danger');
    return;
  }

  $emailInput.val('');
  $passwordInput.val('');

  authenticateUser(email, password);
}


function handleSignupResponse(status) {
  if (status === 'success') {
    displayMessage('Registered successfully! You may now sign in.', 'success');
    setAuth('login');
  } else {
    displayMessage(
      'Something went wrong. A user with this account may already exist.',
      'danger'
    );
  }
}

function handleLoginResponse(data, status, jqXHR) {
  console.log(status, data, jqXHR);
}

function authenticateUser(email, password) {
  $.ajax({
    url: '/' + authSetting,
    data: {
      user: {
        email,
        password
      }
    },
    method: 'POST'

  })
    .then(function(data, status, jqXHR) {
      if (authSetting === 'signup') {
        handleSignupResponse(status);
      } else {
        console.log("im in the else");
        handleLoginResponse(data, status, jqXHR);
      }
    })
    .catch(function(err) {
      if (authSetting === 'signup') {
        handleSignupResponse(err.statusText);
      } else {
        console.log(authSetting);
        handleLoginResponse(err.statusText);
      }
    });
}

$setLogin.on('click', setAuth.bind(null, 'login'));
$setSignUp.on('click', setAuth.bind(null, 'signup'));
$submitButton.on('click', handleFormSubmit);