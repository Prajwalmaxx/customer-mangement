function customerToRow(customer, index = 0, source = 'registered') {
  const companyName = customer.company?.name ?? 'New Customer';
  const customerName = customer.cname ?? 'Customer';
  const logo = companyName.slice(0, 2).toUpperCase();

  return {
    id: `${source}-${customer.cno ?? index}-${companyName}`,
    source,
    cno: customer.cno ?? null,
    rawCustomer: customer,
    company: companyName,
    email: `${customerName.toLowerCase().replace(/\s+/g, '')}@customerdata.com`,
    userName: customerName,
    sessions: customer.cno ?? 0,
    notes: source === 'live' ? 'Live REST Data' : source === 'sample' ? 'Sample Customer' : 'New Customer',
    outstanding: customer.billAmt ?? 0,
    date: formatToday(),
    logo,
    logoClass: source === 'sample' ? 'logo-amazon' : 'logo-live',
  };
}

function sampleRowToViewRow(row) {
  return {
    ...row,
    source: 'sample',
    cno: row.sessions,
    rawCustomer: null,
  };
}

function customerToFormData(customer) {
  if (!customer) {
    return {
      cno: '',
      cname: '',
      billAmt: '',
      favColor: '',
      studies: '',
      phoneNumbers: '',
      idDetails: '',
      companyName: '',
      companyAddrs: '',
      companyType: '',
      companySize: '',
    };
  }

  return {
    cno: customer.cno ?? '',
    cname: customer.cname ?? '',
    billAmt: customer.billAmt ?? '',
    favColor: Array.isArray(customer.favColor) ? customer.favColor.join(', ') : '',
    studies: Array.isArray(customer.studies) ? customer.studies.join(', ') : '',
    phoneNumbers: Array.isArray(customer.phoneNumbers) ? customer.phoneNumbers.join(', ') : '',
    idDetails: customer.idDetails
      ? Object.entries(customer.idDetails)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
      : '',
    companyName: customer.company?.name ?? '',
    companyAddrs: customer.company?.addrs ?? '',
    companyType: customer.company?.type ?? '',
    companySize: customer.company?.size ?? '',
  };
}

function formDataToCustomerPayload(formData) {
  return {
    cno: Number(formData.cno),
    cname: formData.cname,
    billAmt: Number(formData.billAmt),
    favColor: formData.favColor.split(',').map((item) => item.trim()),
    studies: formData.studies.split(',').map((item) => item.trim()),
    phoneNumbers: formData.phoneNumbers.split(',').map((item) => Number(item.trim())),
    idDetails: Object.fromEntries(
      formData.idDetails.split(',').map((entry) => {
        const [key, value] = entry.split(':').map((item) => item.trim());
        return [key, value];
      }),
    ),
    company: {
      name: formData.companyName,
      addrs: formData.companyAddrs,
      type: formData.companyType,
      size: Number(formData.companySize),
    },
  };
}
