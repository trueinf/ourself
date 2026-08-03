import { useState, type FormEvent } from 'react';
import { useApp } from '@/store/app';
import { PERSONAS } from '@/data/personas';

/** The offices behind the gate, read off the persona set — never a second list
 *  to keep in sync (§8.1). */
const OFFICES = PERSONAS.map((p) => {
  const parts = p.name.split(' ');
  return `${p.role} · ${parts[parts.length - 1]}`;
});

/**
 * Demo sign-in gate. Renders instead of the shell until credentials match
 * (data/auth.ts). Presentation only — nothing behind it is protected, and the
 * demo credentials are shown on the card by design.
 */
export function Login() {
  const signIn = useApp((s) => s.signIn);
  const authError = useApp((s) => s.authError);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    signIn(username, password);
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
        <span className="wm">
          ours<i>e.l.f.</i>
        </span>
        <h1 className="login-tag">One company. Many selves.</h1>
        <p className="login-lede">
          A cross-functional executive intelligence surface for e.l.f. Beauty. Each office sees the same business
          reality read against its own objective — and can see how the others read the same fact.
        </p>
        <div className="login-offices">
          {OFFICES.map((office) => (
            <span key={office} className="login-office">
              {office}
            </span>
          ))}
        </div>
        <div className="login-foot">
          Demo build · FY2027 Q1 on verified FY2026 actuals. Nothing behind this gate acts — the effect buttons are
          inert by design.
        </div>
      </aside>

      <div className="login-panel">
        <form className="login-card" onSubmit={onSubmit} noValidate>
          <div className="login-eyebrow">Executive surface</div>
          <h2 className="login-h">Sign in</h2>
          <div className="login-sub">Pick up where your office left off.</div>

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
              onChange={(e) => edit(setPassword)(e.target.value)}
            />
          </label>

          {authError ? (
            <div className="login-err" role="alert">
              {authError}
            </div>
          ) : null}

          <button type="submit" className="btn login-btn">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
