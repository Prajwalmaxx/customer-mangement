import React from 'react';

export default function RegisterCustomerModal({
  title = 'Register Customer',
  submitLabel = 'Submit',
  formData,
  submitError,
  onClose,
  onChange,
  onSubmit,
}) {
  return (
    <div className="register-modal" role="dialog" aria-modal="true" aria-labelledby="register-title">
      <div className="register-modal__backdrop" onClick={onClose} />
      <section className="register-modal__card">
        <div className="register-modal__head">
          <h2 id="register-title">{title}</h2>
          <button type="button" className="register-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={onSubmit} className="form-grid">
          {submitError && <div className="auth-error register-error">{submitError}</div>}
          <input
            name="cno"
            type="number"
            value={formData.cno}
            onChange={onChange}
            placeholder="Customer Number (e.g. 101)"
          />
          <input name="cname" value={formData.cname} onChange={onChange} placeholder="Customer Name" />
          <input
            name="billAmt"
            type="number"
            value={formData.billAmt}
            onChange={onChange}
            placeholder="Bill Amount"
          />
          <input
            name="favColor"
            value={formData.favColor}
            onChange={onChange}
            placeholder="Favorite Colors"
          />
          <input name="studies" value={formData.studies} onChange={onChange} placeholder="Studies" />
          <input
            name="phoneNumbers"
            value={formData.phoneNumbers}
            onChange={onChange}
            placeholder="Phone Numbers (comma separated)"
          />
          <input name="idDetails" value={formData.idDetails} onChange={onChange} placeholder="ID Details (aadhar: 123, panNo: ABCD1234F)" />
          <input
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            placeholder="Company Name"
          />
          <input
            name="companyAddrs"
            value={formData.companyAddrs}
            onChange={onChange}
            placeholder="Company Address"
          />
          <input
            name="companyType"
            value={formData.companyType}
            onChange={onChange}
            placeholder="Company Type"
          />
          <input
            name="companySize"
            type="number"
            value={formData.companySize}
            onChange={onChange}
            placeholder="Company Size"
          />
          <button type="submit" className="btn-primary register-submit">
            {submitLabel}
          </button>
        </form>
      </section>
    </div>
  );
}
