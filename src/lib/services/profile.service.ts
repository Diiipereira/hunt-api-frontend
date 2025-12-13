import { api } from './api';

interface PasswordUpdateData {
	current: string;
	newPass: string;
	confirm: string;
}

export class ProfileService {
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

		return null;
	}

	static async updatePassword(current: string, newPass: string) {
		const response = await api('/users/me/password', {
			method: 'PATCH',
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
