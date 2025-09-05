import type { Transacao } from "../types/transacao";
import Resumo from "../components/Resumo";

interface Props {
    transacoes: Transacao[];
}

function Home({ transacoes }: Props) {
    return (
        <div>
            <Resumo transacoes={transacoes} />
        </div>
    );
}

export default Home;
