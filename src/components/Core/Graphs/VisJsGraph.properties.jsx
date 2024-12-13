const typeConfigs = {
  domain: {
    node: { size: 20, color: '#9e9e9e', fontsize: 20 },
    edge: { length: 100 }
  },
  field: {
    node: { size: 15, color: '#64B5CD', fontsize: 15 },
    edge: { length: 100 }
  },
  branch: {
    node: { size: 10, color: '#ff5722', fontsize: 10 },
    edge: { length: 100 }
  },
  subject: {
    node: { size: 8, color: '#0077cc', fontsize: 8 },
    edge: { length: 100 }
  },
  topic: {
    node: { size: 5, color: '#8bc34a', fontsize: 5 },
    edge: { length: 100 }
  },
  concept: {
    node: { size: 3, color: '#64B5CD', fontsize: 3 },
    edge: { length: 100 }
  }
};

const defaultConfig = {
  node: { size: 5, color: '#64B5CD' },
  edge: { length: 100 }
};

const getVisProperties = (type) => {
  return typeConfigs[type] || defaultConfig;
};

export default getVisProperties;
