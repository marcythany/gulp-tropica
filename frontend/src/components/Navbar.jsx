import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	FaHome,
	FaHeart,
	FaUser,
	FaSignInAlt,
	FaSignOutAlt,
} from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<nav className='bg-blue-600 text-white shadow-lg'>
			<div className='container mx-auto px-4'>
				<div className='flex justify-between items-center h-16'>
					<div className='flex items-center space-x-4'>
						<Link to='/' className='text-xl font-bold'>
							Gulp-Tropica
						</Link>
					</div>

					<div className='flex items-center space-x-4'>
						<Link
							to='/'
							className='flex items-center space-x-1 hover:text-blue-200'
						>
							<FaHome className='text-lg' />
							<span>Home</span>
						</Link>

						{user ? (
							<>
								<Link
									to='/favorites'
									className='flex items-center space-x-1 hover:text-blue-200'
								>
									<FaHeart className='text-lg' />
									<span>Favoritos</span>
								</Link>

								<Link
									to='/profile'
									className='flex items-center space-x-1 hover:text-blue-200'
								>
									<FaUser className='text-lg' />
									<span>Perfil</span>
								</Link>

								<button
									onClick={handleLogout}
									className='flex items-center space-x-1 hover:text-blue-200'
								>
									<FaSignOutAlt className='text-lg' />
									<span>Sair</span>
								</button>
							</>
						) : (
							<Link
								to='/login'
								className='flex items-center space-x-1 hover:text-blue-200'
							>
								<FaSignInAlt className='text-lg' />
								<span>Login</span>
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
