
import clienteAxios from '../Helpers/clienteAxios';

export const useIniciarSesion = async (form) => {
    const { data } = await clienteAxios.post('login',form);
    return data;
}