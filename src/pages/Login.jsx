import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { loginUser, registerUser } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarsenha: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (isLogin) {
      try {
        const { email, senha } = formData;
        const data = await loginUser(email, senha);
        toast.success('Login realizado com sucesso!');

        // Guarda token
        if (data.token) {
          localStorage.setItem('token', data.token);
        } else {
          throw new Error('Token não recebido');
        }

        // Guarda clienteId convertendo para string
        if (data.clienteId !== undefined && data.clienteId !== null) {
          localStorage.setItem('clienteId', String(data.clienteId));
        } else {
          console.warn('⚠️ clienteId ausente no login:', data);
          localStorage.removeItem('clienteId');
        }

        // Guarda nome do usuário (prioriza userName, cai em nome)
        if (data.userName || data.nome) {
          localStorage.setItem('userName', data.userName || data.nome);
        } else {
          localStorage.removeItem('userName');
        }

        navigate('/');
      } catch (error) {
        toast.error(error.message || 'Erro ao fazer login');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const { nome, email, senha, confirmarsenha } = formData;

        if (senha !== confirmarsenha) {
          toast.error('As senhas não coincidem.');
          setLoading(false);
          return;
        }

        await registerUser(nome, email, senha);
        toast.success('Registro realizado com sucesso!');
        navigate('/login');
      } catch (error) {
        toast.error(error.message || 'Erro ao registrar');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="login-page"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3e8ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div className="form" style={{ width: '100%', maxWidth: '400px' }}>
        <form onSubmit={handleSubmit}>
          <img
            src={assets.logo}
            alt="Logo"
            style={{
              display: 'block',
              margin: '0 auto 20px',
              width: '80px',
              height: 'auto',
            }}
          />

          {!isLogin && (
            <input
              type="text"
              name="nome"
              placeholder="Nome *"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="E-mail *"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha *"
            value={formData.senha}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmarsenha"
              placeholder="Confirmar Senha *"
              value={formData.confirmarsenha}
              onChange={handleChange}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              backgroundColor: '#591E65',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#3f154b')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#591E65')}
          >
            {loading
              ? isLogin
                ? 'Entrando...'
                : 'Registrando...'
              : isLogin
              ? 'Login'
              : 'Registrar'}
          </button>

          <p className="message" style={{ marginTop: '15px', textAlign: 'center' }}>
            {isLogin ? (
              <>
                Não tem uma conta?{' '}
                <a href="/register" style={{ color: '#591E65', fontWeight: 'bold' }}>
                  Criar conta!
                </a>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <a href="/login" style={{ color: '#591E65', fontWeight: 'bold' }}>
                  Login
                </a>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
