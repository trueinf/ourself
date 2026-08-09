import { useState, type FormEvent } from 'react';
import { useApp } from '@/store/app';
import { DEMO_USERNAME, DEMO_PASSWORD } from '@/data/auth';

/**
 * Demo sign-in gate. Renders instead of the shell until credentials match
 * (data/auth.ts). Presentation only — nothing behind it is protected, and the
 * demo credentials are shown on the card by design.
 */
export function Login() {
  const signIn = useApp((s) => s.signIn);
  const authError = useApp((s) => s.authError);
  // Fields start empty; the demo credentials are shown as a hint below.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (signingIn) return;
    // Brief pause so the sign-in reads as a real hand-off into the app.
    setSigningIn(true);
    window.setTimeout(() => {
      const ok = signIn(username, password);
      if (!ok) setSigningIn(false);
    }, 2500);
  };

  // Editing after a failed attempt clears the error, so it never sits stale
  // against the value being retyped.
  const edit = (setter: (v: string) => void) => (value: string) => {
    if (authError) useApp.setState({ authError: null });
    setter(value);
  };

  return (
    <div className="login">
      <aside className="login-brand">
        <img className="login-brand-img" src="/elf-background.jpg" alt="e.l.f. Beauty lipsticks" />
      </aside>

      <div className="login-panel">
        <form className="login-card" onSubmit={onSubmit} noValidate>
          <div className="login-eyebrow">Executive hub</div>
          <h2 className="login-h">Sign in</h2>
          <div className="login-sub">Pick up where you left off.</div>

          <label className="login-field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Your username"
              value={username}
              disabled={signingIn}
              onChange={(e) => edit(setUsername)(e.target.value)}
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              disabled={signingIn}
              onChange={(e) => edit(setPassword)(e.target.value)}
            />
          </label>

          {authError ? (
            <div className="login-err" role="alert">
              {authError}
            </div>
          ) : null}

          <button type="submit" className="btn login-btn" disabled={signingIn} aria-busy={signingIn}>
            {signingIn ? (
              <>
                <span className="login-spin" aria-hidden="true" />
                Signing you in…
              </>
            ) : (
              'Sign in'
            )}
          </button>

          <p className="login-hint">
            Demo access · sign in with <code>{DEMO_USERNAME}</code> / <code>{DEMO_PASSWORD}</code>
          </p>
        </form>
      </div>
    </div>
  );
}
