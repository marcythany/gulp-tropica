import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
	return (
		<AuthProvider>
			<Router
				future={{
					v7_relativeSplatPath: true,
				}}
			>
				<div className='min-h-screen bg-gray-100'>
					<Navbar />
					<main className='container mx-auto py-6 px-4'>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/login' element={<LoginPage />} />

							{/* Protegendo as rotas privadas */}
							<Route
								path='/profile'
								element={
									<PrivateRoute>
										<ProfilePage />
									</PrivateRoute>
								}
							/>
							<Route
								path='/favorites'
								element={
									<PrivateRoute>
										<FavoritesPage />
									</PrivateRoute>
								}
							/>
						</Routes>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
