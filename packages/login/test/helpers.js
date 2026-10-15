export function fillUsernameAndPassword(login) {
  const { _userNameField: vaadinLoginUsername, _passwordField: vaadinLoginPassword } = login;
  const usernameValue = 'username';
  const passwordValue = 'password';

  vaadinLoginUsername.value = usernameValue;
  vaadinLoginPassword.value = passwordValue;

  return { vaadinLoginUsername, vaadinLoginPassword };
}
