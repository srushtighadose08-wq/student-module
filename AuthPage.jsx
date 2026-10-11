import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  Building, 
  BookOpen, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Registration Form State
  const [regRole, setRegRole] = useState('STUDENT'); // 'STUDENT' | 'FACULTY' | 'HOD'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [classYear, setClassYear] = useState('');
  const [rollOrEmpNumber, setRollOrEmpNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('student.alex@college.edu');
  const [loginPassword, setLoginPassword] = useState('StudentPass@123');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const depts = await authApi.getDepartments();
        setDepartments(depts || []);
        if (depts && depts.length > 0) {
          setDepartmentId(depts[0].id.toString());
        }
        const cls = await authApi.getClasses();
        setClasses(cls || []);
      } catch (err) {
        console.warn('Failed to load initial metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await authApi.login({
        email: loginEmail,
        password: loginPassword
      });

      if (response && response.token) {
        login(response);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter both fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    setLoading(true);
    try {
      const selectedDept = departments.find(d => d.id.toString() === departmentId.toString());
      
      const response = await authApi.register({
        fullName,
        email,
        role: regRole,
        departmentId: departmentId ? Number(departmentId) : undefined,
        departmentName: selectedDept ? selectedDept.name : undefined,
        classYear: regRole === 'STUDENT' ? classYear : undefined,
        rollOrEmpNumber,
        phoneNumber,
        password,
        confirmPassword
      });

      setSuccessMsg(response.message || 'Registration submitted! Please await account approval.');
      // Pre-fill login email and switch after delay
      setLoginEmail(email);
      setLoginPassword('');
      setTimeout(() => {
        setActiveTab('login');
      }, 2500);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'student') {
      setLoginEmail('student.alex@college.edu');
      setLoginPassword('StudentPass@123');
    } else if (role === 'faculty') {
      setLoginEmail('faculty.john@college.edu');
      setLoginPassword('FacultyPass@123');
    } else if (role === 'hod') {
      setLoginEmail('hod.cse@college.edu');
      setLoginPassword('HodPass@123');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header Branding */}
        <div className="auth-header">
          <div className="auth-logo">
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>College Student Portal</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            {activeTab === 'login' ? 'Sign in to access your dashboard' : 'Create an academic account'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Register
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ==========================================================
            LOGIN FORM
            ========================================================== */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">College Email Address</label>
              <div className="password-input-wrapper">
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@college.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>

            {/* Quick Demo Logins Helper */}
            <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Quick Test Accounts:
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('student')}
                  style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a' }}
                >
                  👨‍🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('faculty')}
                  style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a' }}
                >
                  👨‍🏫 Faculty
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('hod')}
                  style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a' }}
                >
                  🏛️ HOD
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ==========================================================
            REGISTRATION FORM
            ========================================================== */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            {/* Role Selector Pills */}
            <div className="form-group">
              <label className="form-label">Select Your Role</label>
              <div className="role-selector-pills">
                <button
                  type="button"
                  className={`role-pill-btn ${regRole === 'STUDENT' ? 'active' : ''}`}
                  onClick={() => setRegRole('STUDENT')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`role-pill-btn ${regRole === 'FACULTY' ? 'active' : ''}`}
                  onClick={() => setRegRole('FACULTY')}
                >
                  Faculty
                </button>
                <button
                  type="button"
                  className={`role-pill-btn ${regRole === 'HOD' ? 'active' : ''}`}
                  onClick={() => setRegRole('HOD')}
                >
                  HOD
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid-2" style={{ gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {regRole === 'STUDENT' ? (
                <div className="form-group">
                  <label className="form-label">Class / Year</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 3rd Year (CS-3A)"
                    value={classYear}
                    onChange={(e) => setClassYear(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Employee / Staff ID</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. FAC-CSE-202"
                    value={rollOrEmpNumber}
                    onChange={(e) => setRollOrEmpNumber(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="grid-2" style={{ gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
              ℹ️ <strong>Approval notice:</strong> New registrations are placed in <strong>PENDING</strong> status until reviewed and approved by your department {regRole === 'STUDENT' ? 'faculty' : 'HOD'}.
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Submitting Registration...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
