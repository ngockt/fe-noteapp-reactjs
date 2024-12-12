const typeConfigs = {
    domain: {
      node: { size: 20, color: '#9e9e9e' },
      edge: { length: 100 }
    },
    field: {
      node: { size: 18, color: '#64B5CD' },
      edge: { length: 100 }
    },
    branch: {
      node: { size: 15, color: '#ff5722' },
      edge: { length: 100 }
    },
    subject: {
      node: { size: 12, color: '#0077cc' },
      edge: { length: 100 }
    },
    topic: {
      node: { size: 10, color: '#8bc34a' },
      edge: { length: 100 }
    },
    concept: {
      node: { size: 5, color: '#64B5CD' },
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
  