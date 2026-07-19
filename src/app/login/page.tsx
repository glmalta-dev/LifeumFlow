"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Se a sessao real ja estiver ativa, redireciona para a area protegida.
  useEffect(() => {
    const session = document.cookie.includes("lifeum-flow-session-jwt");
    if (session) {
      router.push("/hoje");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Preencha todos os campos!", "error");
      return;
    }

    setIsLoading(true);

    try {
      if (!supabase) {
        showToast("Conexao com o Supabase nao configurada!", "error");
        setIsLoading(false);
        return;
      }

      // 1. Tenta realizar o login real do Supabase
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // 2. Se o usuário não existir no Supabase, tentamos registrá-lo na hora (auto-onboarding de teste)
      if (
        error &&
        (error.message.includes("Invalid login credentials") || error.message.includes("User not found")) &&
        email === "clinica@lifeum.com"
      ) {
        // Tenta cadastrar o usuário no Supabase Auth
        const signUpRes = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: "Administrador Clinico",
            },
          },
        });

        if (!signUpRes.error) {
          // Se cadastrado com sucesso, tenta logar novamente
          const retryRes = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          data = retryRes.data;
          error = retryRes.error;
        } else {
          error = signUpRes.error;
        }
      }

      if (error) {
        showToast(error.message || "E-mail ou senha incorretos!", "error");
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        // Grava sessão via cookie JWT real (para leitura segura pelo Middleware Next.js)
        const maxAge = 60 * 60 * 24 * 7; // 7 dias
        document.cookie = `lifeum-flow-session-jwt=${data.session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;

        // O e-mail e apenas preferencia de interface; dados clinicos ficam no Supabase.
        localStorage.setItem("user-email", email);

        showToast("Login realizado com sucesso!", "success");
        router.push("/hoje");
      }
    } catch (err: unknown) {
      console.error(err);
      showToast(getErrorMessage(err, "Erro ao realizar login. Tente novamente."), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.brandBlock}>
        <h1 style={styles.brandTitle}>Lifeum Flow</h1>
        <p style={styles.brandSubtitle}>Gestão Ativa Odontológica</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="form-group" style={styles.formGroup}>
          <label htmlFor="login-email" className="form-label" style={styles.label}>
            E-MAIL CLÍNICO
          </label>
          <input
            id="login-email"
            name="email"
            type="text"
            className="form-control"
            placeholder="Ex: clinica@lifeum.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={styles.input}
          />
        </div>

        <div className="form-group" style={styles.formGroup}>
          <label htmlFor="login-password" className="form-label" style={styles.label}>
            SENHA DE ACESSO
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            className="form-control"
            placeholder="Digite sua senha..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={styles.input}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? "Acessando..." : "Entrar no Painel"}
        </button>
      </form>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Utilize <strong>clinica@lifeum.com</strong> e senha <strong>lifeum123</strong> para acessar.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: "24px",
    gap: "32px",
    backgroundColor: "var(--bg-app)",
  },
  brandBlock: {
    textAlign: "center" as const,
  },
  brandTitle: {
    fontSize: "28px",
    fontWeight: 800,
    color: "var(--text-primary)",
    fontFamily: "var(--font-family-title)",
    letterSpacing: "-0.5px",
  },
  brandSubtitle: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginTop: "4px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid var(--outline-variant)",
    borderRadius: "12px",
    fontSize: "14px",
    color: "var(--text-primary)",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  button: {
    padding: "14px",
    fontSize: "14px",
    fontWeight: 700,
    borderRadius: "12px",
    marginTop: "8px",
  },
  footer: {
    textAlign: "center" as const,
    marginTop: "8px",
  },
  footerText: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
};
