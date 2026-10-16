import React, { useEffect, useState } from "react";
import HaitianLogo from "../Images/HaitianLogoWhite.png";
import HaitianBackgroundImage from "../Images/HaitianMachine.jpg";
import { Button, Form, Input, notification } from "antd";
import "../App.css";
import "../Login.css";
import {

  EyeOutlined,
  SafetyOutlined,

} from "@ant-design/icons";

notification.config({
  maxCount: 2,
  placement: "bottomRight",
  duration: 3,
});

// Keep the existing backend endpoint and request format unchanged.
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyjYt3jIx-VVg0tp50AN0khR74N_vMFgvmtC9H5LbqkZlPSrsNT_lPIWGDjHoupyysKQQ/exec";

export default function Login({ onLoginSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [initialAnimation, setInitialAnimation] = useState(true);

  useEffect(() => {
    if (!shake) return undefined;
    const timer = window.setTimeout(() => setShake(false), 450);
    return () => window.clearTimeout(timer);
  }, [shake]);

  useEffect(() => {
    const timer = window.setTimeout(() => setInitialAnimation(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (values) => {
    if (!navigator.onLine) {
      notification.error({
        message: "No Internet Connection",
        description: "Please check your internet and try again.",
      });
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "loginUser",
          userEmail: String(values.userEmail || "").trim(),
          password: String(values.password || ""),
        }).toString(),
        signal: controller.signal,
      });

      if (response.status === 404) {
        const error = new Error(
          "Google Apps Script Web App returned HTTP 404. Check the deployment URL and access permissions."
        );
        error.code = "GAS_DEPLOYMENT_404";
        throw error;
      }
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Google Apps Script returned invalid JSON.");
      }

      if (data && data.success) {
        notification.success({
          message: "Login Successful",
          description: `Welcome ${String(values.userEmail || "")
            .trim()
            .split("@")[0]}!`,
        });

        if (typeof onLoginSuccess === "function") {
          onLoginSuccess({
            email: String(values.userEmail || "").trim(),
            access: data.access,
          });
        } else {
          notification.error({
            message: "Login Handler Missing",
            description: "The app did not provide an onLoginSuccess handler.",
          });
        }
      } else {
        setShake(true);
        notification.error({
          message: "Login Failed",
          description: (data && data.message) || "Invalid email or password.",
        });
      }
    } catch (error) {
      notification.error({
        message:
          error && error.code === "GAS_DEPLOYMENT_404"
            ? "Backend Deployment Error"
            : "Unable to Log In",
        description:
          error && error.name === "AbortError"
            ? "Login request timed out. Please try again."
            : (error && error.message) || "Unable to connect to the backend.",
      });
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <main className="haitian-login-page">
      <div
        className={`haitian-login-shell ${
          initialAnimation ? "login-entrance" : ""
        }`}
      >
        <section
          className="haitian-brand-panel"
          aria-label="Haitian Service Report"
        >
          <img
            src={HaitianBackgroundImage}
            className="haitian-banner-image"
            alt="Haitian industrial injection moulding machines"
            aria-hidden="true"
          />
          <div className="haitian-banner-overlay" aria-hidden="true" />

          <header className="brand-top">
            <img src={HaitianLogo} alt="Haitian logo" className="brand-logo" />
          </header>

          <div className="brand-content">
            <div className="brand-eyebrow">HAITIAN SERVICE REPORT</div>
            <h1>
              Service reports.
              <br />
              <span>Organized. Reliable.</span>
            </h1>
            {/* <p>
              A central workspace for customer visits, machine details, service
              findings, and follow-up actions.
            </p> */}

            <div className="brand-feature-list" aria-label="Portal features">
              <div className="brand-feature">
                <span className="brand-feature-index" aria-hidden="true">
                  01
                </span>
                <span className="brand-feature-copy">
                  <strong>Service records</strong>
                  <small>Create and manage service reports</small>
                </span>
              </div>
              <div className="brand-feature">
                <span className="brand-feature-index" aria-hidden="true">
                  02
                </span>
                <span className="brand-feature-copy">
                  <strong>Customer and machine details</strong>
                  <small>Keep visit information in one place</small>
                </span>
              </div>
              <div className="brand-feature">
                <span className="brand-feature-index" aria-hidden="true">
                  03
                </span>
                <span className="brand-feature-copy">
                  <strong>Effortless search</strong>
                  <small>Track findings and next actions</small>
                </span>
              </div>
            </div>
          </div>

      
        </section>

        <section className="haitian-form-panel" aria-label="Sign in">
          <div className={`haitian-login-card ${shake ? "login-shake" : ""}`}>
        
            <div className="login-heading">
              <h2>Welcome back<span>.</span></h2>
              <p>Sign in with your company account to continue.</p>
            </div>

            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={handleSubmit}
              className="haitian-login-form"
            >
              <Form.Item
                label="Work email"
                name="userEmail"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter your email address.",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address.",
                  },
                ]}
              >
                <Input
                  size="large"
                  type="email"
                  autoComplete="username"
                  placeholder="username@haitianme.com"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password.",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </Form.Item>

              <Button
                className="haitian-login-button"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                disabled={loading}
              >
                <span>{loading ? "Signing in..." : "Sign in securely"}</span>
                {!loading && (
                  <span className="login-button-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </Button>

              <div className="login-security-note">
                <span  >
                  <SafetyOutlined />
                </span>
                <span>Authorized personnel only</span>
              </div>
            </Form>

            <footer className="login-card-footer">
              <span>© {new Date().getFullYear()} Haitian Service Report</span>
              <span className="login-footer-separator" aria-hidden="true">
                •
              </span>
              <span>All rights reserved</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
