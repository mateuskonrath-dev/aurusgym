export const EXERCISES = {
    gym: {
        chest: [
            { id: 'g_ch_1', name: 'Supino Reto (Barra)', muscle: 'Peito', sets: 4, reps: '8-10', tier: 1, howTo: 'Deite no banco, pés firmes no chão. Desça a barra até o meio do peito e empurre com explosão.', proTip: 'Mantenha as escápulas aduzidas para proteger os ombros.', muscles: { primary: ['Peitoral Maior'], secondary: ['Tríceps', 'Deltoide Frontal'] } },
            { id: 'g_ch_1b', name: 'Supino Reto (Halter)', muscle: 'Peito', sets: 4, reps: '8-10', tier: 1, howTo: 'Desça os halteres lateralmente ao peito, mantendo os cotovelos a 45 graus.', proTip: 'Halteres permitem uma amplitude maior que a barra.', muscles: { primary: ['Peitoral Maior'], secondary: ['Tríceps'] } },
            { id: 'g_ch_2', name: 'Supino Inclinado (Halter)', muscle: 'Peito', sets: 3, reps: '10-12', tier: 1, howTo: 'Banco a 30-45 graus. Foco total na parte superior do peito.', proTip: 'Não deixe os halteres se tocarem no topo para manter a tensão.', muscles: { primary: ['Peitoral Superior'], secondary: ['Deltoide Frontal'] } },
            { id: 'g_ch_3', name: 'Pec Deck (Voador)', muscle: 'Peito', sets: 3, reps: '12-15', tier: 3, howTo: 'Mantenha os cotovelos levemente flexionados e esprema o peito no centro.', proTip: 'Imagine que está abraçando um barril gigante.', muscles: { primary: ['Peitoral Maior'], secondary: ['Deltoide Frontal'] } },
            { id: 'g_ch_4', name: 'Cross-over (Polia Alta)', muscle: 'Peito', sets: 3, reps: '12-15', tier: 3, howTo: 'Puxe os cabos de cima para baixo, cruzando as mãos levemente no final.', proTip: 'Foco na contração de pico no final do movimento.', muscles: { primary: ['Peitoral Inferior'], secondary: ['Serrátil'] } },
            { id: 'g_ch_5', name: 'Supino Declinado', muscle: 'Peito', sets: 3, reps: '10-12', tier: 2, howTo: 'Desça a barra ou halter na parte inferior do peitoral.', proTip: 'Excelente para recrutar a porção inferior sem sobrecarregar tanto os ombros.', muscles: { primary: ['Peitoral Inferior'], secondary: ['Tríceps'] } }
        ],
        back: [
            { id: 'g_bk_1', name: 'Puxada Frente (Aberta)', muscle: 'Costas', sets: 4, reps: '10-12', tier: 1, howTo: 'Puxe a barra em direção ao peitoral superior, não atrás da nuca.', proTip: 'Puxe com os cotovelos, não com a força das mãos.', muscles: { primary: ['Latíssimo do Dorso'], secondary: ['Bíceps', 'Braquial'] } },
            { id: 'g_bk_2', name: 'Remada Curvada (Barra)', muscle: 'Costas', sets: 4, reps: '8-10', tier: 1, howTo: 'Tronco inclinado, puxando a barra em direção ao umbigo.', proTip: 'Mantenha a coluna neutra e core ativado o tempo todo.', muscles: { primary: ['Romboides', 'Dorsais'], secondary: ['Bíceps'] } },
            { id: 'g_bk_3', name: 'Serrote (Halter)', muscle: 'Costas', sets: 3, reps: '12', tier: 2, howTo: 'Puxe o halter rente ao corpo unilateramente, focando na dorsal.', proTip: 'Não rotacione o tronco excessivamente.', muscles: { primary: ['Latíssimo Inferior'], secondary: ['Bíceps'] } },
            { id: 'g_bk_4', name: 'Remada Cavalinho', muscle: 'Costas', sets: 3, reps: '10', tier: 1, howTo: 'Use o suporte V e puxe a carga concentrando no meio das costas.', proTip: 'Esprema as escápulas no topo do movimento.', muscles: { primary: ['Miolo das Costas'], secondary: ['Bíceps'] } },
            { id: 'g_bk_5', name: 'Puxada Triângulo', muscle: 'Costas', sets: 3, reps: '12', tier: 2, howTo: 'Puxe o triângulo até o peito, projetando o tórax para frente.', proTip: 'Ótimo para isolar a porção central do dorso.', muscles: { primary: ['Latíssimo do Dorso'], secondary: ['Bíceps'] } }
        ],
        shoulders: [
            { id: 'g_sh_1', name: 'Desenvolvimento (Halter)', muscle: 'Ombros', sets: 3, reps: '10', tier: 1, howTo: 'Sentado ou em pé, empurre os halteres para cima até estender quase totalmente os braços.', proTip: 'Não bata os halteres no topo e desça até a altura das orelhas.', muscles: { primary: ['Deltoide Frontal'], secondary: ['Tríceps', 'Deltoide Lateral'] } },
            { id: 'g_sh_2', name: 'Elevação Lateral (Cabo)', muscle: 'Ombros', sets: 3, reps: '12-15', tier: 3, howTo: 'Suba o cabo lateralmente mantendo o cotovelo levemente flexionado.', proTip: 'O uso do cabo mantém a tensão constante em toda a amplitude.', muscles: { primary: ['Deltoide Lateral'], secondary: ['Trapézio'] } },
            { id: 'g_sh_3', name: 'Elevação Frontal (Anilha)', muscle: 'Ombros', sets: 3, reps: '12', tier: 2, howTo: 'Segure a anilha e suba até a altura dos olhos, controlando a descida.', proTip: 'Mantenha o core firme para não balançar o corpo.', muscles: { primary: ['Deltoide Frontal'], secondary: ['Serrátil'] } },
            { id: 'g_sh_4', name: 'Crucifixo Inverso', muscle: 'Ombros', sets: 3, reps: '15', tier: 3, howTo: 'Inclinado para frente ou em máquina, afaste os braços focando na parte posterior do ombro.', proTip: 'Pense em "afastar" o peso, não apenas puxar.', muscles: { primary: ['Deltoide Posterior'], secondary: ['Romboides'] } },
            { id: 'g_sh_5', name: 'Remada Alta (Polia)', muscle: 'Ombros', sets: 3, reps: '12', tier: 2, howTo: 'Puxe a barra em direção ao queixo, elevando os cotovelos acima da linha dos ombros.', proTip: 'Mantenha a barra próxima ao corpo durante toda a puxada.', muscles: { primary: ['Trapézio', 'Deltoide Lateral'] } }
        ],
        legs: [
            { id: 'g_lg_1', name: 'Agachamento Livre', muscle: 'Pernas', sets: 4, reps: '8-10', tier: 1, howTo: 'Barra nos trapézios, desça o quadril como se fosse sentar em uma cadeira, mantendo a coluna reta.', proTip: 'Mantenha o peso nos calcanhares e o peito aberto.', muscles: { primary: ['Quadríceps', 'Glúteos'], secondary: ['Eretores da Espinha'] } },
            { id: 'g_lg_2', name: 'Leg Press 45', muscle: 'Pernas', sets: 4, reps: '10-12', tier: 1, howTo: 'Pés na largura dos ombros, desça a plataforma controladamente sem tirar o quadril do banco.', proTip: 'Não estenda totalmente os joelhos no topo (bloqueio).', muscles: { primary: ['Quadríceps'], secondary: ['Glúteos'] } },
            { id: 'g_lg_3', name: 'Cadeira Extensora', muscle: 'Pernas', sets: 3, reps: '12-15', tier: 3, howTo: 'Sente-se bem apoiado e estenda as pernas focando na contração do quadríceps.', proTip: 'Segure 1 segundo no topo para máxima contração.', muscles: { primary: ['Quadríceps'] } },
            { id: 'g_lg_4', name: 'Mesa Flexora', muscle: 'Pernas', sets: 3, reps: '10-12', tier: 3, howTo: 'Deitado, flexione os joelhos trazendo o rolo em direção ao glúteo.', proTip: 'Mantenha o quadril colado no banco durante o movimento.', muscles: { primary: ['Isquiotibiais'] } },
            { id: 'g_lg_5', name: 'Stiff (Barra)', muscle: 'Pernas', sets: 4, reps: '10', tier: 1, howTo: 'Pernas quase estendidas, desça a barra rente às pernas jogando o quadril para trás.', proTip: 'Sinta o alongamento dos posteriores, não use a lombar.', muscles: { primary: ['Isquiotibiais', 'Glúteo'], secondary: ['Eretores da Espinha'] } },
            { id: 'g_lg_6', name: 'Elevação Pélvica', muscle: 'Pernas', sets: 4, reps: '10-12', tier: 1, howTo: 'Costas apoiadas no banco, barra no quadril, suba o peso contraindo os glúteos ao máximo.', proTip: 'Faça uma pausa de 2 segundos no topo.', muscles: { primary: ['Glúteo Máximo'], secondary: ['Isquiotibiais'] } },
            { id: 'g_lg_7', name: 'Cadeira Abdutora', muscle: 'Pernas', sets: 3, reps: '15', tier: 3, howTo: 'Afaste as pernas contra a resistência, focando no glúteo médio.', proTip: 'Incline o tronco levemente para frente para maior ativação.', muscles: { primary: ['Glúteo Médio', 'Tensor da Fáscia Lata'] } },
            { id: 'g_lg_8', name: 'Panturrilha Sentado', muscle: 'Pernas', sets: 4, reps: '15-20', tier: 3, howTo: 'Eleve o peso na ponta dos pés, alongando bem na descida.', proTip: 'A pausa no ponto de maior alongamento ajuda a quebrar o reflexo elástico.', muscles: { primary: ['Panturrilha'] } }
        ],
        triceps: [
            { id: 'g_tr_1', name: 'Tríceps Pulley', muscle: 'Tríceps', sets: 3, reps: '12-15', tier: 3, howTo: 'Cotovelos fixos ao lado do corpo, estenda os braços puxando a barra para baixo.', proTip: 'Mantenha os ombros relaxados e longe das orelhas.', muscles: { primary: ['Tríceps Braquial'] } },
            { id: 'g_tr_2', name: 'Tríceps Testa', muscle: 'Tríceps', sets: 3, reps: '10-12', tier: 2, howTo: 'Deitado, desça a barra ou halteres em direção à testa, mantendo os cotovelos paralelos.', proTip: 'Foco na porção longa do tríceps.', muscles: { primary: ['Tríceps (Cabeça Longa)'] } },
            { id: 'g_tr_3', name: 'Tríceps Corda', muscle: 'Tríceps', sets: 3, reps: '15', tier: 3, howTo: 'Abra a corda no final da extensão para maior pico de contração.', proTip: 'Não use o corpo para dar embalo.', muscles: { primary: ['Tríceps (Cabeça Lateral)'] } },
            { id: 'g_tr_4', name: 'Mergulho Paralelas', muscle: 'Tríceps', sets: 3, reps: 'Máx', tier: 1, howTo: 'Corpo vertical, desça controladamente e suba focando na força do braço.', proTip: 'Incline menos o tronco para focar no tríceps e não no peito.', muscles: { primary: ['Tríceps Braquial'], secondary: ['Peitoral Inferior'] } }
        ],
        biceps: [
            { id: 'g_bi_1', name: 'Rosca Direta', muscle: 'Bíceps', sets: 3, reps: '10-12', tier: 2, howTo: 'Suba a barra em arco, sem mover os cotovelos para frente.', proTip: 'Evite o "roubo" com a lombar.', muscles: { primary: ['Bíceps Braquial'] } },
            { id: 'g_bi_3', name: 'Rosca Martelo', muscle: 'Bíceps', sets: 3, reps: '12', tier: 2, howTo: 'Pegada neutra (palmas para dentro), suba o halter mantendo o cotovelo fixo.', proTip: 'Excelente para desenvolver o braquiorradial (antebraço).', muscles: { primary: ['Braquial', 'Braquiorradial'] } },
            { id: 'g_bi_4', name: 'Rosca Scott', muscle: 'Bíceps', sets: 3, reps: '10', tier: 2, howTo: 'Apoie os braços no banco Scott e realize a rosca com amplitude completa.', proTip: 'Não estenda totalmente o braço para não sobrecarregar o tendão.', muscles: { primary: ['Bíceps Braquial (Braça Curta)'] } },
            { id: 'g_bi_5', name: 'Rosca Concentrada', muscle: 'Bíceps', sets: 3, reps: '12', tier: 3, howTo: 'Sentado, apoie o cotovelo na parte interna da coxa e faça a rosca.', proTip: 'Foco no pico do bíceps.', muscles: { primary: ['Bíceps Braquial'] } }
        ],
        core: [
            { id: 'g_co_1', name: 'Abdominal Polia', muscle: 'Abs', sets: 4, reps: '15-20', tier: 3, howTo: 'Ajoelhado, segure a corda acima da cabeça e "enrole" o tronco em direção ao chão.', proTip: 'O movimento deve ser de enrolar a coluna, não de dobrar o quadril.', muscles: { primary: ['Reto Abdominal'] } },
            { id: 'g_co_2', name: 'Elevação de Pernas', muscle: 'Abs', sets: 4, reps: '15', tier: 2, howTo: 'Suspenso ou deitado, eleve as pernas até formar um ângulo de 90 graus.', proTip: 'Mantenha o movimento controlado na descida.', muscles: { primary: ['Infra Abdominal', 'Flexores do Quadril'] } },
            { id: 'g_co_3', name: 'Prancha Isométrica', muscle: 'Abs', sets: 3, reps: '60s', tier: 3, howTo: 'Corpo reto apoiado nos antebraços e pontas dos pés, mantenha a contração.', proTip: 'Não deixe o quadril cair nem subir demais.', muscles: { primary: ['Transverso do Abdômen', 'Core'] } }
        ],
        forearms: [
            { id: 'g_fo_1', name: 'Rosca Inversa', muscle: 'Antebraços', sets: 3, reps: '12-15', tier: 3, howTo: 'Pegada pronada (palmas para baixo), suba a barra focando no antebraço.', proTip: 'Aperte a barra com força para aumentar a ativação.', muscles: { primary: ['Extensores do Pulso'] } },
            { id: 'g_fo_2', name: 'Flexão de Punho', muscle: 'Antebraços', sets: 3, reps: '15', tier: 3, howTo: 'Antebraços apoiados nas coxas, mova apenas os punhos para cima.', proTip: 'Use halteres para permitir uma pegada mais confortável.', muscles: { primary: ['Flexores do Pulso'] } }
        ]
    },
    home: {
        chest: [
            { id: 'h_ch_1', name: 'Flexão de Braços', muscle: 'Peito', sets: 4, reps: 'Máx', tier: 1, howTo: 'Mantenha o corpo reto como uma prancha, desça o peito até quase tocar o chão e suba explosivamente.', proTip: 'Se estiver difícil, faça com os joelhos apoiados para manter a técnica.', muscles: { primary: ['Peito'], secondary: ['Tríceps', 'Deltoide Frontal'] } },
            { id: 'h_ch_2', name: 'Flexão Diamante', muscle: 'Peito', sets: 3, reps: 'Máx', tier: 2, howTo: 'Mãos juntas formando um diamante abaixo do peito, desça focando no tríceps e miolo do peito.', proTip: 'Mantenha os cotovelos fechados próximos ao corpo.', muscles: { primary: ['Peito Interno', 'Tríceps'] } },
            { id: 'h_ch_3', name: 'Flexão Inclinada', muscle: 'Peito', sets: 4, reps: 'Máx', tier: 2, howTo: 'Mãos apoiadas em um sofá ou cadeira estável, realize a flexão focando na parte inferior do peito.', proTip: 'Excelente para recrutar a porção inferior sem equipamentos.', muscles: { primary: ['Peito Inferior'], secondary: ['Tríceps'] } }
        ],
        back: [
            { id: 'h_bk_1', name: 'Remada (Halter/Mochila)', muscle: 'Costas', sets: 4, reps: '12', tier: 1, howTo: 'Incline o tronco, segure o peso e puxe em direção ao quadril espremendo as costas.', proTip: 'Use uma mochila com livros para ajustar a carga.', muscles: { primary: ['Costas'], secondary: ['Bíceps'] } },
            { id: 'h_bk_2', name: 'Barra Fixa (Se houver)', muscle: 'Costas', sets: 4, reps: 'Máx', tier: 1, howTo: 'Pendure-se e puxe o queixo acima da barra, controlando a descida.', proTip: 'Se não tiver barra, use a porta ou uma toalha (com segurança).', muscles: { primary: ['Dorsais'], secondary: ['Bíceps'] } },
            { id: 'h_bk_3', name: 'Anjo na Neve (Chão)', muscle: 'Costas', sets: 3, reps: '15', tier: 3, howTo: 'Deitado de bruços, braços estendidos, faça o movimento de anjo sem tocar as mãos no chão.', proTip: 'Mantenha o peito levemente fora do chão para ativar a lombar.', muscles: { primary: ['Paravertebrais', 'Dorsais'] } }
        ],
        shoulders: [
            { id: 'h_sh_1', name: 'Flexão Pike', muscle: 'Ombros', sets: 3, reps: '10', tier: 1, howTo: 'Posição de V invertido, desça a cabeça em direção ao chão e empurre para cima.', proTip: 'Quanto mais vertical o corpo, mais pesado fica para o ombro.', muscles: { primary: ['Ombros'], secondary: ['Tríceps'] } },
            { id: 'h_sh_2', name: 'Elevação Lateral (Halter)', muscle: 'Ombros', sets: 3, reps: '15', tier: 3, howTo: 'Suba os pesos lateralmente até a altura dos ombros.', proTip: 'Pode usar garrafas de água como peso.', muscles: { primary: ['Deltoide Lateral'] } },
            { id: 'h_sh_3', name: 'Desenvolvimento (Halter)', muscle: 'Ombros', sets: 3, reps: '12', tier: 1, howTo: 'Empurre a carga para cima acima da cabeça.', proTip: 'Mantenha as costas retas, se puder sente em uma cadeira com encosto.', muscles: { primary: ['Ombros'], secondary: ['Tríceps'] } }
        ],
        legs: [
            { id: 'h_lg_1', name: 'Agachamento Taça', muscle: 'Pernas', sets: 4, reps: '15', tier: 1, howTo: 'Segure o peso junto ao peito e agache mantendo a postura ereta.', proTip: 'Mantenha os cotovelos por dentro dos joelhos no fundo do agachamento.', muscles: { primary: ['Quadríceps'] } },
            { id: 'h_lg_2', name: 'Afundo', muscle: 'Pernas', sets: 3, reps: '12', tier: 1, howTo: 'Dê um passo à frente e desça o joelho de trás em direção ao chão.', proTip: 'Mantenha o tronco reto para focar no quadríceps.', muscles: { primary: ['Quadríceps', 'Glúteos'] } },
            { id: 'h_lg_3', name: 'Elevação Pélvica Solo', muscle: 'Pernas', sets: 4, reps: '20', tier: 2, howTo: 'Deitado, suba o quadril contraindo os glúteos.', proTip: 'Coloque um peso sobre a pelve para aumentar a dificuldade.', muscles: { primary: ['Glúteos'], secondary: ['Isquiotibiais'] } },
            { id: 'h_lg_4', name: 'Pistol Squat (Apoio)', muscle: 'Pernas', sets: 3, reps: '8', tier: 1, howTo: 'Agachamento unilateral com uma perna estendida para frente, use apoio se necessário.', proTip: 'Exercício de alto nível para força e equilíbrio.', muscles: { primary: ['Quadríceps', 'Glúteos'] } }
        ],
        triceps: [
            { id: 'h_tr_1', name: 'Mergulho no Banco', muscle: 'Tríceps', sets: 3, reps: 'Máx', tier: 2, howTo: 'Mãos apoiadas em um banco ou cadeira atrás do corpo, suba e desça focando no braço.', proTip: 'Estenda as pernas para dificultar.', muscles: { primary: ['Tríceps'] } },
            { id: 'h_tr_2', name: 'Extensão Unilateral', muscle: 'Tríceps', sets: 3, reps: '12', tier: 3, howTo: 'Segure o peso e estenda o braço acima da cabeça.', proTip: 'Mantenha o cotovelo apontado para o teto.', muscles: { primary: ['Tríceps'] } },
            { id: 'h_tr_3', name: 'Flexão Fechada', muscle: 'Tríceps', sets: 3, reps: 'Máx', tier: 1, howTo: 'Mãos na largura dos ombros, desça mantendo os cotovelos raspando nas costelas.', proTip: 'Foco total na parte de trás do braço.', muscles: { primary: ['Tríceps'] } }
        ],
        biceps: [
            { id: 'h_bi_1', name: 'Rosca (Halter)', muscle: 'Bíceps', sets: 4, reps: '12', tier: 2, howTo: 'Segure o peso e flexione o braço girando o pulso para cima no final.', proTip: 'Não use o corpo para dar impulso.', muscles: { primary: ['Bíceps'] } },
            { id: 'h_bi_2', name: 'Rosca Martelo (Mochila)', muscle: 'Bíceps', sets: 4, reps: '12', tier: 2, howTo: 'Puxada neutra com o peso, focando na lateral do braço.', proTip: 'Use a alça da mochila para uma pegada firme.', muscles: { primary: ['Braquial'] } }
        ],
        core: [
            { id: 'h_co_1', name: 'Mountain Climbers', muscle: 'Core', sets: 4, reps: '45s', tier: 3, howTo: 'Posição de flexão, traga os joelhos em direção ao peito em ritmo acelerado.', proTip: 'Mantenha o quadril baixo e o core travado.', muscles: { primary: ['Core'] } },
            { id: 'h_co_2', name: 'Abdominal Supra', muscle: 'Core', sets: 4, reps: '20', tier: 3, howTo: 'Deitado, contraia o abdômen tirando apenas as escápulas do chão.', proTip: 'Não puxe o pescoço com as mãos.', muscles: { primary: ['Abs'] } },
            { id: 'h_co_3', name: 'Prancha Lateral', muscle: 'Core', sets: 3, reps: '30s', tier: 3, howTo: 'Apoie-se em um antebraço de lado e mantenha o corpo alinhado.', proTip: 'Trabalha intensamente os oblíquos.', muscles: { primary: ['Core', 'Oblíquos'] } }
        ],
        forearms: [
            { id: 'h_fo_1', name: 'Caminhada do Fazendeiro', muscle: 'Antebraços', sets: 3, reps: '45s', tier: 3, howTo: 'Segure os pesos mais pesados que encontrar e caminhe mantendo a postura.', proTip: 'Ótimo para força de pegada e trapézio.', muscles: { primary: ['Grip Strength'] } }
        ]
    },
    calisthenics: {
        chest: [
            { id: 'c_ch_1', name: 'Flexão de Braços', muscle: 'Peito', sets: 4, reps: 'Máx', tier: 1, howTo: 'Mantenha o corpo reto, desça o peito até quase tocar o chão e suba explosivamente.', proTip: 'Mantenha o core travado durante todo o movimento.', muscles: { primary: ['Peito'], secondary: ['Tríceps', 'Deltoide'] } },
            { id: 'c_ch_2', name: 'Flexão Diamante', muscle: 'Peito', sets: 3, reps: 'Máx', tier: 2, howTo: 'Mãos juntas formando um diamante, desça focando no tríceps e miolo do peito.', proTip: 'Foco na contração de pico no topo.', muscles: { primary: ['Peito Interno', 'Tríceps'] } },
            { id: 'c_ch_3', name: 'Flexão Inclinada', muscle: 'Peito', sets: 4, reps: 'Máx', tier: 2, howTo: 'Mãos apoiadas em um local elevado (sofá/cadeira), realize a flexão para focar no peito inferior.', proTip: 'Excelente variação para volume extra.', muscles: { primary: ['Peito Inferior'] } }
        ],
        back: [
            { id: 'c_bk_1', name: 'Anjo na Neve (Chão)', muscle: 'Costas', sets: 3, reps: '15', tier: 3, howTo: 'Deitado de bruços, faça movimentos circulares com os braços sem tocar o chão.', proTip: 'Aperte as escápulas em cada repetição.', muscles: { primary: ['Dorsais', 'Lombar'] } },
            { id: 'c_bk_2', name: 'Superman Isométrico', muscle: 'Costas', sets: 4, reps: '30s', tier: 1, howTo: 'Deitado de bruços, eleve braços e pernas simultaneamente e segure.', proTip: 'Mantenha o olhar para o chão para não sobrecarregar o pescoço.', muscles: { primary: ['Eretores da Espinha'] } },
            { id: 'c_bk_3', name: 'Barra Fixa (Opcional)', muscle: 'Costas', sets: 4, reps: 'Máx', tier: 1, howTo: 'Se tiver acesso a uma barra, realize barras completas.', proTip: 'Totalmente bodyweight.', muscles: { primary: ['Costas'], secondary: ['Bíceps'] } }
        ],
        shoulders: [
            { id: 'c_sh_1', name: 'Flexão Pike', muscle: 'Ombros', sets: 3, reps: '10', tier: 1, howTo: 'Quadril elevado em V, desça a cabeça em direção ao chão.', proTip: 'Foco total no deltoide frontal.', muscles: { primary: ['Ombros'], secondary: ['Tríceps'] } },
            { id: 'c_sh_2', name: 'Prancha Dinâmica', muscle: 'Ombros', sets: 3, reps: '12', tier: 2, howTo: 'Alternar entre prancha baixa (cotovelos) e prancha alta (mãos).', proTip: 'Estabilize bem o quadril durante a transição.', muscles: { primary: ['Ombros', 'Core'] } }
        ],
        legs: [
            { id: 'c_lg_1', name: 'Agachamento Livre', muscle: 'Pernas', sets: 4, reps: '20', tier: 1, howTo: 'Agache profundamente mantendo o calcanhar no chão.', proTip: 'Mantenha o tronco o mais vertical possível.', muscles: { primary: ['Quadríceps', 'Glúteo'] } },
            { id: 'c_lg_2', name: 'Afundo', muscle: 'Pernas', sets: 3, reps: '15', tier: 1, howTo: 'Dê um passo à frente e desça o joelho traseiro.', proTip: 'Amplitude máxima para ativação do glúteo.', muscles: { primary: ['Quadríceps', 'Glúteos'] } },
            { id: 'c_lg_3', name: 'Elevação Pélvica Solo', muscle: 'Pernas', sets: 4, reps: '20', tier: 2, howTo: 'Deitado, suba o quadril contraindo os glúteos ao máximo.', proTip: 'Segure 2 segundos no topo.', muscles: { primary: ['Glúteos'] } },
            { id: 'c_lg_4', name: 'Pistol Squat (Apoio)', muscle: 'Pernas', sets: 3, reps: '8', tier: 1, howTo: 'Agachamento unilateral usando apoio se necessário.', proTip: 'O ápice da força de pernas no peso do corpo.', muscles: { primary: ['Quadríceps', 'Glúteos'] } }
        ],
        triceps: [
            { id: 'c_tr_1', name: 'Mergulho no Banco', muscle: 'Tríceps', sets: 3, reps: 'Máx', tier: 2, howTo: 'Apoie-se em uma cadeira atrás de você e realize o mergulho.', proTip: 'Mantenha os cotovelos apontados para trás.', muscles: { primary: ['Tríceps'] } },
            { id: 'c_tr_2', name: 'Flexão Fechada', muscle: 'Tríceps', sets: 3, reps: 'Máx', tier: 1, howTo: 'Mãos na largura dos ombros, cotovelos raspando nas costelas.', proTip: 'Extrema ativação da cabeça lateral do tríceps.', muscles: { primary: ['Tríceps'] } }
        ],
        biceps: [
            { id: 'c_bi_1', name: 'Rosca Inversa Dinâmica', muscle: 'Bíceps', sets: 3, reps: '15', tier: 3, howTo: 'Realize o movimento de rosca contraindo o bíceps ao máximo de forma isométrica atenuada.', proTip: 'Mantenha a mente no músculo.', muscles: { primary: ['Bíceps'] } }
        ],
        core: [
            { id: 'c_co_1', name: 'Mountain Climbers', muscle: 'Core', sets: 4, reps: '45s', tier: 3, howTo: 'Posição de prancha alta, traga os joelhos ao peito em velocidade.', proTip: 'Cardio e Core integrados.', muscles: { primary: ['Core'] } },
            { id: 'c_co_2', name: 'Abdominal Supra', muscle: 'Core', sets: 4, reps: '20', tier: 3, howTo: 'Curto e controlado, focando na parte superior do abdômen.', proTip: 'Sinta cada fibra contraindo.', muscles: { primary: ['Abs'] } },
            { id: 'c_co_3', name: 'Prancha Isométrica', muscle: 'Core', sets: 3, reps: '60s', tier: 3, howTo: 'Corpo reto, antebraços no chão, segure a posição.', proTip: 'Respire fundo e mantenha o foco.', muscles: { primary: ['Core'] } }
        ]
    }
};

export const SPLITS = {
    full_body: { days: { 1: ['chest', 'back', 'legs', 'core'], 3: ['chest', 'shoulders', 'legs', 'triceps', 'biceps'], 5: ['back', 'legs', 'shoulders', 'core'] }, default: ['chest', 'back', 'legs', 'core'] },
    upper_lower: { days: { 1: ['chest', 'triceps'], 2: ['back', 'biceps'], 4: ['legs'], 5: ['shoulders', 'core'] }, default: ['chest', 'back', 'legs'] },
    ppl: { days: { 1: ['chest', 'shoulders', 'triceps'], 2: ['back', 'biceps', 'forearms'], 3: ['legs', 'core'], 4: ['chest', 'shoulders', 'triceps'], 5: ['back', 'biceps', 'forearms'], 6: ['legs', 'core'] }, default: ['chest', 'shoulders', 'triceps'] },
    bro_split: { days: { 1: ['chest', 'core'], 2: ['back', 'forearms'], 3: ['legs'], 4: ['shoulders', 'core'], 5: ['biceps', 'triceps'] }, default: ['chest'] }
};

export function generateDailyWorkout(profile, dayIndex) {
    const location = profile.place === 'gym' ? 'gym' : (profile.place === 'calisthenics' ? 'calisthenics' : 'home');
    let muscles = SPLITS[profile.freq].days[dayIndex] || [];
    if (muscles.length === 0) return [];

    if (profile.sex === 'female' && profile.includeChest === 'no') {
        muscles = muscles.filter(m => m !== 'chest');
    }

    let workout = [];
    let targetTotal;

    if (profile.exerciseQty && profile.exerciseQty !== 'none') {
        targetTotal = Math.min(6, parseInt(profile.exerciseQty));
    } else {
        // Rotação: 5, 4, 6 exercícios para quem não tem preferência
        const variation = [5, 4, 6];
        targetTotal = variation[dayIndex % variation.length];
    }

    let pools = muscles.map(muscle => {
        let list = [...(EXERCISES[location][muscle] || [])];
        return list.sort((a, b) => (a.tier || 3) - (b.tier || 3));
    }).filter(p => p.length > 0);

    if (pools.length > 0) {
        let poolIndex = 0;
        while (workout.length < targetTotal) {
            const currentPool = pools[poolIndex];
            if (currentPool.length > 0) {
                workout.push(currentPool.shift());
            }

            poolIndex = (poolIndex + 1) % pools.length;

            // Safety break if all pools are empty
            if (pools.every(p => p.length === 0)) break;
        }
    }

    return workout;
}

const MUSCLE_LABELS = {
    chest: 'Peito',
    back: 'Costas',
    shoulders: 'Ombros',
    legs: 'Pernas',
    triceps: 'Tríceps',
    biceps: 'Bíceps',
    core: 'Core',
    forearms: 'Antebraços'
};

export function generateWeeklyPlan(profile) {
    const days = [1, 2, 3, 4, 5, 6, 7];
    return days.map(day => {
        let muscles = SPLITS[profile.freq].days[day] || [];
        
        // Apply exclusion filters to the labeling
        if (profile.sex === 'female' && profile.includeChest === 'no') {
            muscles = muscles.filter(m => m !== 'chest');
        }

        const isRest = muscles.length === 0;
        return {
            day,
            label: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][day - 1],
            isRest,
            focus: isRest ? 'Recuperação' : muscles.map(m => MUSCLE_LABELS[m] || m).join(' & '),
            workout: generateDailyWorkout(profile, day)
        };
    });
}
