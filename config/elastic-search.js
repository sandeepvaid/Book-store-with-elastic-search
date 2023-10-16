const { Client } = require('@elastic/elasticsearch');
// Elasticsearch Client
const esClient = new Client({ node: 'http://localhost:9200' });

module.exports = {
    esClient
};
