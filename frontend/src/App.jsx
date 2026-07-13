import { useMemo, useState } from "react";
import "./App.css";

const API_URL =
  "https://customer-churn-prediction-api-jahr.onrender.com";

const initialForm = {
  gender: 1,
  SeniorCitizen: 0,
  Partner: 1,
  Dependents: 0,
  tenure: 12,
  PhoneService: 1,
  MultipleLines: 0,
  InternetService: 1,
  OnlineSecurity: 0,
  OnlineBackup: 1,
  DeviceProtection: 0,
  TechSupport: 0,
  StreamingTV: 1,
  StreamingMovies: 1,
  Contract: 0,
  PaperlessBilling: 1,
  PaymentMethod: 2,
  MonthlyCharges: 85.5,
  TotalCharges: 1026.0,
};

const yesNoOptions = [
  { label: "No", value: 0 },
  { label: "Yes", value: 1 },
];

const internetFeatureOptions = [
  { label: "No", value: 0 },
  { label: "No internet service", value: 1 },
  { label: "Yes", value: 2 },
];

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const riskLevel = useMemo(() => {
    if (!result) {
      return null;
    }

    const probability = result.churn_probability;

    if (probability >= 70) {
      return "High Risk";
    }

    if (probability >= 40) {
      return "Medium Risk";
    }

    return "Low Risk";
  }, [result]);

  const updateValue = (name, value) => {
    setFormData((current) => ({
      ...current,
      [name]: Number(value),
    }));

    setResult(null);
    setError("");
  };

  const validateForm = () => {
    if (formData.tenure < 0 || formData.tenure > 72) {
      return "Tenure must be between 0 and 72 months.";
    }

    if (formData.MonthlyCharges < 0) {
      return "Monthly charges cannot be negative.";
    }

    if (formData.TotalCharges < 0) {
      return "Total charges cannot be negative.";
    }

    return "";
  };

  const predictChurn = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          errorData || `Prediction failed with status ${response.status}`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (requestError) {
      console.error("Prediction error:", requestError);
      setError(
        "Could not connect to the prediction server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setResult(null);
    setError("");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-mark">CP</div>
          <h2>ChurnPredict</h2>
          <p>AI-powered customer retention insights</p>
        </div>

        <div className="sidebar-card">
          <span>Model</span>
          <strong>Random Forest</strong>
        </div>

        <div className="sidebar-card">
          <span>Accuracy</span>
          <strong>77.11%</strong>
        </div>

        <div className="sidebar-note">
          Predict customer churn risk before the customer leaves.
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Customer Intelligence</p>
            <h1>Customer Churn Prediction</h1>
            <p className="subtitle">
              Enter customer details to estimate churn probability and risk.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={resetForm}
          >
            Reset Form
          </button>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <span>Model Type</span>
            <strong>Classification</strong>
          </article>

          <article className="stat-card">
            <span>Input Features</span>
            <strong>19</strong>
          </article>

          <article className="stat-card">
            <span>Prediction Output</span>
            <strong>Churn Risk</strong>
          </article>
        </section>

        <section className="workspace-grid">
          <div className="form-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Customer Profile</p>
                <h2>Account and Service Details</h2>
              </div>
            </div>

            <div className="form-grid">
              <Field label="Gender">
                <select
                  value={formData.gender}
                  onChange={(event) =>
                    updateValue("gender", event.target.value)
                  }
                >
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </Field>

              <Field label="Senior Citizen">
                <OptionSelect
                  value={formData.SeniorCitizen}
                  options={yesNoOptions}
                  onChange={(value) =>
                    updateValue("SeniorCitizen", value)
                  }
                />
              </Field>

              <Field label="Partner">
                <OptionSelect
                  value={formData.Partner}
                  options={yesNoOptions}
                  onChange={(value) => updateValue("Partner", value)}
                />
              </Field>

              <Field label="Dependents">
                <OptionSelect
                  value={formData.Dependents}
                  options={yesNoOptions}
                  onChange={(value) => updateValue("Dependents", value)}
                />
              </Field>

              <Field label="Tenure (Months)">
                <input
                  type="number"
                  min="0"
                  max="72"
                  value={formData.tenure}
                  onChange={(event) =>
                    updateValue("tenure", event.target.value)
                  }
                />
              </Field>

              <Field label="Phone Service">
                <OptionSelect
                  value={formData.PhoneService}
                  options={yesNoOptions}
                  onChange={(value) =>
                    updateValue("PhoneService", value)
                  }
                />
              </Field>

              <Field label="Multiple Lines">
                <select
                  value={formData.MultipleLines}
                  onChange={(event) =>
                    updateValue("MultipleLines", event.target.value)
                  }
                >
                  <option value="0">No</option>
                  <option value="1">No phone service</option>
                  <option value="2">Yes</option>
                </select>
              </Field>

              <Field label="Internet Service">
                <select
                  value={formData.InternetService}
                  onChange={(event) =>
                    updateValue("InternetService", event.target.value)
                  }
                >
                  <option value="0">DSL</option>
                  <option value="1">Fiber optic</option>
                  <option value="2">No</option>
                </select>
              </Field>

              <Field label="Online Security">
                <OptionSelect
                  value={formData.OnlineSecurity}
                  options={internetFeatureOptions}
                  onChange={(value) =>
                    updateValue("OnlineSecurity", value)
                  }
                />
              </Field>

              <Field label="Online Backup">
                <OptionSelect
                  value={formData.OnlineBackup}
                  options={internetFeatureOptions}
                  onChange={(value) =>
                    updateValue("OnlineBackup", value)
                  }
                />
              </Field>

              <Field label="Device Protection">
                <OptionSelect
                  value={formData.DeviceProtection}
                  options={internetFeatureOptions}
                  onChange={(value) =>
                    updateValue("DeviceProtection", value)
                  }
                />
              </Field>

              <Field label="Tech Support">
                <OptionSelect
                  value={formData.TechSupport}
                  options={internetFeatureOptions}
                  onChange={(value) =>
                    updateValue("TechSupport", value)
                  }
                />
              </Field>

              <Field label="Streaming TV">
                <OptionSelect
                  value={formData.StreamingTV}
                  options={internetFeatureOptions}
                  onChange={(value) =>
                    updateValue("StreamingTV", value)
                  }
                />
              </Field>

              <Field label="Streaming Movies">
                <OptionSelect
                  value={formData.StreamingMovies}
                  options={internetFeatureOptions}
                  onChange={(value) =>
                    updateValue("StreamingMovies", value)
                  }
                />
              </Field>

              <Field label="Contract">
                <select
                  value={formData.Contract}
                  onChange={(event) =>
                    updateValue("Contract", event.target.value)
                  }
                >
                  <option value="0">Month-to-month</option>
                  <option value="1">One year</option>
                  <option value="2">Two year</option>
                </select>
              </Field>

              <Field label="Paperless Billing">
                <OptionSelect
                  value={formData.PaperlessBilling}
                  options={yesNoOptions}
                  onChange={(value) =>
                    updateValue("PaperlessBilling", value)
                  }
                />
              </Field>

              <Field label="Payment Method">
                <select
                  value={formData.PaymentMethod}
                  onChange={(event) =>
                    updateValue("PaymentMethod", event.target.value)
                  }
                >
                  <option value="0">Bank transfer automatic</option>
                  <option value="1">Credit card automatic</option>
                  <option value="2">Electronic check</option>
                  <option value="3">Mailed check</option>
                </select>
              </Field>

              <Field label="Monthly Charges">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.MonthlyCharges}
                  onChange={(event) =>
                    updateValue("MonthlyCharges", event.target.value)
                  }
                />
              </Field>

              <Field label="Total Charges">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.TotalCharges}
                  onChange={(event) =>
                    updateValue("TotalCharges", event.target.value)
                  }
                />
              </Field>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="button"
              className="primary-button"
              onClick={predictChurn}
              disabled={loading}
            >
              {loading ? "Analyzing Customer..." : "Predict Churn Risk"}
            </button>
          </div>

          <div className="result-panel">
            {!result ? (
              <div className="empty-state">
                <div className="empty-icon">AI</div>
                <h2>Prediction Results</h2>
                <p>
                  Complete the form and run the model to see churn probability,
                  risk level, and retention guidance.
                </p>
              </div>
            ) : (
              <>
                <p className="eyebrow">Prediction Summary</p>
                <h2>{result.result}</h2>

                <div
                  className={`risk-badge ${
                    result.prediction === 1 ? "risk-high" : "risk-low"
                  }`}
                >
                  {riskLevel}
                </div>

                <div className="probability-wrap">
                  <div className="probability-top">
                    <span>Churn Probability</span>
                    <strong>{result.churn_probability}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${result.churn_probability}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="insight-card">
                  <span>Recommended Action</span>
                  <p>
                    {result.prediction === 1
                      ? "Prioritize this customer for a retention campaign, service review, or loyalty offer."
                      : "Maintain normal engagement and continue monitoring customer satisfaction."}
                  </p>
                </div>

                <div className="summary-list">
                  <div>
                    <span>Contract</span>
                    <strong>
                      {formData.Contract === 0
                        ? "Month-to-month"
                        : formData.Contract === 1
                          ? "One year"
                          : "Two year"}
                    </strong>
                  </div>

                  <div>
                    <span>Tenure</span>
                    <strong>{formData.tenure} months</strong>
                  </div>

                  <div>
                    <span>Monthly Charges</span>
                    <strong>${formData.MonthlyCharges}</strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function OptionSelect({ value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default App;