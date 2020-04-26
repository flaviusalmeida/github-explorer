import React, { useState, FormEvent } from 'react';
import api from '../../services/api';
import logoImg from '../../assests/logo.svg';
import { FiChevronRight } from 'react-icons/fi';

import { Title, Form, Repositories, Error} from './styles';

// Tipo
interface Repositoriy {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {

    const [newRepo, setNewRepo] = useState('');
    // !!inputError = true se tiver preenchido. Poderia ser Boolean(inputError)
    const [inputError, setInputError] = useState('');
    // quando não for o tipo 'simples' é preciso definir uma interface
    const [repositories, setRepositories] = useState<Repositoriy[]>([]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        if(!newRepo) {
            setInputError('Digite autor/nome do repositório');
            return;
        }

        try {
             // com a interface criada é possível definir o tipo do retorno
            const response = await api.get<Repositoriy>(`repos/${newRepo}`);

            const repositoriy = response.data;

            setRepositories([...repositories, repositoriy]);
            setNewRepo('');
            setInputError('');
        } catch(err) {
            setInputError('Erro na busca por esse repositório');
        }
    }

    return (
        <>
            <img src={logoImg} alt="Github explorer" />
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    type="text"
                    placeholder="Digite o nome do repositório"/>
                <button type="submit">Pesquisar</button>
            </Form>

            { inputError && <Error>{inputError}</Error> }

            <Repositories>
                {repositories.map(repositoriy => (
                    <a key={repositoriy.full_name} href="#">
                        <img src={repositoriy.owner.avatar_url}
                            alt={repositoriy.owner.login}/>
                        <div>
                            <strong>{repositoriy.full_name}</strong>
                            <p>{repositoriy.description}</p>
                        </div>
                        <FiChevronRight size={20}/>
                    </a>
                ))}
            </Repositories>
        </>
    );
}
export default Dashboard;
