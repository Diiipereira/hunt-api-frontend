// src/lib/services/profile.service.ts
import { PUBLIC_API_URL } from '$env/static/public';

interface PasswordUpdateData {
	current: string;
	newPass: string;
	confirm: string;
}

export class ProfileService {
	/**
	 * Valida as regras de negócio antes de enviar
	 * Retorna uma string com o erro ou null se estiver tudo ok
	 */
	static validatePasswordChange({ current, newPass, confirm }: PasswordUpdateData): string | null {
		if (!current || !newPass || !confirm) {
			return 'Por favor, preencha todos os campos de senha.';
		}

		if (newPass !== confirm) {
			return 'A nova senha e a confirmação não coincidem.';
		}

		if (newPass.length < 6) {
			return 'A nova senha deve ter pelo menos 6 caracteres.';
		}

		if (current === newPass) {
			return 'A nova senha não pode ser igual à senha atual.';
		}

		return null; // Sem erros
	}

	/**
	 * Realiza a chamada para a API
	 */
	static async updatePassword(token: string, current: string, newPass: string) {
		const response = await fetch(`${PUBLIC_API_URL}/users/me/password`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPassword: current,
				newPassword: newPass
			})
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Erro ao atualizar senha');
		}

		return data;
	}
}
