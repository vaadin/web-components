export function fillUsernameAndPassword(login) {
  const { vaadinLoginUsername, vaadinLoginPassword } = login.$;
  const usernameValue = 'username';
  const passwordValue = 'password';

  vaadinLoginUsername.value = usernameValue;
  vaadinLoginPassword.value = passwordValue;

  return { vaadinLoginUsername, vaadinLoginPassword };
}
