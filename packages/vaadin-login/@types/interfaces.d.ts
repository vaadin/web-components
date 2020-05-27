export interface LoginI18n {
  form: {
    title: string;
    username: string;
    password: string;
    submit: string;
    forgotPassword: string;
  };
  errorMessage: {
    title: string;
    message: string;
  };
  header?: {
    title?: string;
    description?: string;
  };
  additionalInformation?: string;
}
