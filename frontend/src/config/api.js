// Use localhost only for local development; production must use the deployed API.
const API_BASE_URL = process.env.REACT_APP_API_URL || (
	process.env.NODE_ENV === 'production'
		? 'https://edu-track-kappa-eight.vercel.app/api'
		: 'http://localhost:5000/api'
);

export default API_BASE_URL;

