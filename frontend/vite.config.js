import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Carregando variáveis de ambiente do arquivo `.env`
dotenv.config();

export default defineConfig({
	// Defina o caminho base, caso seu projeto esteja hospedado em um subdiretório.
	// Por exemplo, se for 'https://meusite.com/app', use base: '/app/'
	base: process.env.BASE_URL || '/',

	// Plugins
	plugins: [react()],

	// Configurações específicas de build para otimização
	build: {
		outDir: 'dist', // Diretório de saída para arquivos de produção
		sourcemap: true, // Gera sourcemap para depuração (opcional)
		minify: 'esbuild', // Minificador padrão, você pode mudar para 'terser' se preferir
	},

	// Definição de variáveis de ambiente que podem ser usadas no código
	define: {
		'process.env.API_URL': JSON.stringify(process.env.API_URL),
	},

	// Configuração do servidor de desenvolvimento
	server: {
		port: 5000, // Porta padrão do servidor de desenvolvimento
		open: true, // Abre o navegador automaticamente
	},
});
