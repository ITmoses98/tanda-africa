import { GoogleLogin } from "@react-oauth/google";
import { hasGoogleConfig } from "../main";

export default function GoogleLoginButton({ onSuccess, onError, text = "signin_with" }) {
  if (!hasGoogleConfig) return null;

  return (
    <div className="btn-google-wrapper">
      <GoogleLogin
        onSuccess={(res) => {
          if (res?.credential) {
            try {
              const payload = JSON.parse(atob(res.credential.split(".")[1]));
              onSuccess({ name: payload.name, email: payload.email, picture: payload.picture });
            } catch { onError?.(); }
          }
        }}
        onError={onError}
        theme="outline"
        size="large"
        text={text}
        shape="rectangular"
        width="100%"
      />
    </div>
  );
}
