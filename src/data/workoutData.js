export const EXERCISES = {
    gym: {
        chest: [
            { id: 'g_ch_1', name: 'Supino Reto (Barra)', muscle: 'Peito', sets: 4, reps: '8-10', tier: 1, howTo: 'Deite no banco, pés firmes no chão. Desça a barra até o meio do peito e empurre com explosão.', proTip: 'Mantenha as escápulas aduzidas para proteger os ombros.', muscles: { primary: ['Peitoral Maior'], secondary: ['Tríceps', 'Deltoide Frontal'] } },
            { id: 'g_ch_1b', name: 'Supino Reto (Halter)', muscle: 'Peito', sets: 4, reps: '8-10', tier: 1, howTo: 'Desça os halteres lateralmente ao peito, mantendo os cotovelos a 45 graus.', proTip: 'Halteres permitem uma amplitude maior que a barra.', muscles: { primary: ['Peitoral Maior'], secondary: ['Tríceps'] } },
            { id: 'g_ch_2', name: 'Supino Inclinado (Halter)', muscle: 'Peito', sets: 3, reps: '10-12', tier: 1, howTo: 'Banco a 30-45 graus. Foco total na parte superior do peito.', proTip: 'Não deixe os halteres se tocarem no topo para manter a tensão.', muscles: { primary: ['Peitoral Superior'], secondary: ['Deltoide Frontal'] } },
            { id: 'g_ch_3', name: 'Pec Deck (Voador)', muscle: 'Peito', sets: 3, reps: '12-15', tier: 3, howTo: 'Mantenha os cotovelos levemente flexionados e esprema o peito no centro.', proTip: 'Imagine que está abraçando um barril gigante.', muscles: { primary: ['Peitoral Maior'], secondary: ['Deltoide Frontal'] } },
            { id: 'g_ch_4', name: 'Cruzamento (Polia Alta)', muscle: 'Peito', sets: 3, reps: '12-15', tier: 3, howTo: 'Puxe os cabos de cima para baixo, cruzando as mãos levemente no final.', proTip: 'Foco na contração de pico no final do movimento.', muscles: { primary: ['Peitoral Inferior'], secondary: ['Serrátil'] } },
            { id: 'g_ch_5', name: 'Supino Declinado', muscle: 'Peito', sets: 3, reps: '10-12', tier: 2, howTo: 'Desça a barra ou halter na parte inferior do peitoral.', proTip: 'Excelente para recrutar a porção inferior sem sobrecarregar tanto os ombros.', muscles: { primary: ['Peitoral Inferior'], secondary: ['Tríceps'] } },
            { id: 'g_ch_6', name: 'Crucifixo (Halter)', muscle: 'Peito', sets: 3, reps: '12-15', tier: 2, howTo: 'Deitado no banco, desça os halteres lateralmente em arco até sentir o alongamento do peito e retorne.', proTip: 'Mantenha os cotovelos levemente flexionados durante todo o movimento, nunca trave.', muscles: { primary: ['Peitoral Maior'], secondary: ['Deltoide Frontal'] } },
            { id: 'g_ch_7', name: 'Supino Inclinado (Barra)', muscle: 'Peito', sets: 4, reps: '8-10', tier: 1, howTo: 'Banco a 30-45 graus, desça a barra controladamente até o peito superior.', proTip: 'Agarre a barra na largura que forma 90 graus nos cotovelos.', muscles: { primary: ['Peitoral Superior'], secondary: ['Deltoide Frontal', 'Tríceps'] } }
        ],
        back: [
            { id: 'g_bk_1', name: 'Puxada Frente (Aberta)', muscle: 'Costas', sets: 4, reps: '10-12', tier: 1, howTo: 'Puxe a barra em direção ao peitoral superior, não atrás da nuca.', proTip: 'Puxe com os cotovelos, não com a força das mãos.', muscles: { primary: ['Latíssimo do Dorso'], secondary: ['Bíceps', 'Braquial'] } },
            { id: 'g_bk_2', name: 'Remada Curvada (Barra)', muscle: 'Costas', sets: 4, reps: '8-10', tier: 1, howTo: 'Tronco inclinado, puxando a barra em direção ao umbigo.', proTip: 'Mantenha a coluna neutra e core ativado o tempo todo.', muscles: { primary: ['Romboides', 'Dorsais'], secondary: ['Bíceps'] } },
            { id: 'g_bk_3', name: 'Serrote (Halter)', muscle: 'Costas', sets: 3, reps: '12', tier: 2, howTo: 'Puxe o halter rente ao corpo unilateramente, focando na dorsal.', proTip: 'Não rotacione o tronco excessivamente.', muscles: { primary: ['Latíssimo Inferior'], secondary: ['Bíceps'] } },
            { id: 'g_bk_4', name: 'Remada Cavalinho', muscle: 'Costas', sets: 3, reps: '10', tier: 1, howTo: 'Use o suporte V e puxe a carga concentrando no meio das costas.', proTip: 'Esprema as escápulas no topo do movimento.', muscles: { primary: ['Miolo das Costas'], secondary: ['Bíceps'] } },
            { id: 'g_bk_5', name: 'Puxada Triângulo', muscle: 'Costas', sets: 3, reps: '12', tier: 2, howTo: 'Puxe o triângulo até o peito, projetando o tórax para frente.', proTip: 'Ótimo para isolar a porção central do dorso.', muscles: { primary: ['Latíssimo do Dorso'], secondary: ['Bíceps'] } },
            { id: 'g_bk_6', name: 'Levantamento Terra', muscle: 'Costas', sets: 4, reps: '5-6', tier: 1, howTo: 'Barra no chão, agache com a coluna reta e puxe mantendo a barra rente ao corpo até ficar ereto.', proTip: 'O rei dos exercícios. Mantenha o core travado e a barra colada na canela durante a subida.', muscles: { primary: ['Lombar', 'Glúteos', 'Isquiotibiais'], secondary: ['Trapézio', 'Abdômen'] } },
            { id: 'g_bk_7', name: 'Remada Baixa (Polia)', muscle: 'Costas', sets: 3, reps: '12', tier: 2, howTo: 'Sentado no cabo, puxe a barra em direção ao abdômen retraindo as escápulas antes de puxar.', proTip: 'A retração escápular deve anteceder o puxão — não use o bíceps para iniciar.', muscles: { primary: ['Romboides', 'Miolo das Costas'], secondary: ['Bíceps'] } },
            { id: 'g_bk_8', name: 'Pullover (Halter)', muscle: 'Costas', sets: 3, reps: '12', tier: 2, howTo: 'Deitado no banco transversalmente, desça o halter atrás da cabeça sentindo o alongamento das dorsais.', proTip: 'Mantenha os cotovelos levemente flexionados. Ideal para expansão torácica.', muscles: { primary: ['Latíssimo do Dorso'], secondary: ['Peitoral'] } },
            { id: 'g_bk_9', name: 'Barra Fixa', muscle: 'Costas', sets: 4, reps: 'Máx', tier: 1, howTo: 'Puxe o queixo acima da barra com a pegada pronada, controlando a descida por 3 segundos.', proTip: 'A descida controlada (excêntrico) é responsável por grande parte dos ganhos.', muscles: { primary: ['Latíssimo do Dorso'], secondary: ['Bíceps', 'Braquial'] } }
        ],
        shoulders: [
            { id: 'g_sh_1', name: 'Desenvolvimento (Halter)', muscle: 'Ombros', sets: 3, reps: '10', tier: 1, howTo: 'Sentado ou em pé, empurre os halteres para cima até estender quase totalmente os braços.', proTip: 'Não bata os halteres no topo e desça até a altura das orelhas.', muscles: { primary: ['Deltoide Frontal'], secondary: ['Tríceps', 'Deltoide Lateral'] } },
            { id: 'g_sh_2', name: 'Elevação Lateral (Cabo)', muscle: 'Ombros', sets: 3, reps: '12-15', tier: 3, howTo: 'Suba o cabo lateralmente mantendo o cotovelo levemente flexionado.', proTip: 'O uso do cabo mantém a tensão constante em toda a amplitude.', muscles: { primary: ['Deltoide Lateral'], secondary: ['Trapézio'] } },
            { id: 'g_sh_3', name: 'Elevação Frontal (Anilha)', muscle: 'Ombros', sets: 3, reps: '12', tier: 2, howTo: 'Segure a anilha e suba até a altura dos olhos, controlando a descida.', proTip: 'Mantenha o core firme para não balançar o corpo.', muscles: { primary: ['Deltoide Frontal'], secondary: ['Serrátil'] } },
            { id: 'g_sh_4', name: 'Crucifixo Inverso', muscle: 'Ombros', sets: 3, reps: '15', tier: 3, howTo: 'Inclinado para frente ou em máquina, afaste os braços focando na parte posterior do ombro.', proTip: 'Pense em "afastar" o peso, não apenas puxar.', muscles: { primary: ['Deltoide Posterior'], secondary: ['Romboides'] } },
            { id: 'g_sh_5', name: 'Remada Alta (Polia)', muscle: 'Ombros', sets: 3, reps: '12', tier: 2, howTo: 'Puxe a barra em direção ao queixo, elevando os cotovelos acima da linha dos ombros.', proTip: 'Mantenha a barra próxima ao corpo durante toda a puxada.', muscles: { primary: ['Trapézio', 'Deltoide Lateral'] } },
            { id: 'g_sh_6', name: 'Puxada Facial (Corda)', muscle: 'Ombros', sets: 3, reps: '15-20', tier: 3, howTo: 'Polia na altura dos olhos, puxe a corda em direção ao rosto abrindo os cotovelos para fora.', proTip: 'Essencial para saúde dos ombros e rotadores externos. Não negligencie este exercício.', muscles: { primary: ['Deltoide Posterior', 'Rotadores Externos'], secondary: ['Trapézio Médio'] } },
            { id: 'g_sh_7', name: 'Desenvolvimento Arnold', muscle: 'Ombros', sets: 3, reps: '10-12', tier: 2, howTo: 'Inicie com palmas voltadas para você, rotacione os halteres enquanto sobe até as palmas ficarem para fora.', proTip: 'Recruta os três feixes do deltoide em um único movimento composto.', muscles: { primary: ['Deltoide Frontal', 'Deltoide Lateral'], secondary: ['Tríceps'] } },
            { id: 'g_sh_8', name: 'Elevação Lateral (Halter)', muscle: 'Ombros', sets: 4, reps: '12-15', tier: 2, howTo: 'Suba os halteres lateralmente até a altura dos ombros com cotovelos levemente flexionados.', proTip: 'Incline levemente o tronco para frente e use o polegar apontado para baixo para maior ativação.', muscles: { primary: ['Deltoide Lateral'] } }
        ],
        legs: [
            { id: 'g_lg_1', name: 'Agachamento Livre', muscle: 'Pernas', sets: 4, reps: '8-10', tier: 1, howTo: 'Barra nos trapézios, desça o quadril como se fosse sentar em uma cadeira, mantendo a coluna reta.', proTip: 'Mantenha o peso nos calcanhares e o peito aberto.', muscles: { primary: ['Quadríceps', 'Glúteos'], secondary: ['Eretores da Espinha'] } },
            { id: 'g_lg_2', name: 'Leg Press 45', muscle: 'Pernas', sets: 4, reps: '10-12', tier: 1, howTo: 'Pés na largura dos ombros, desça a plataforma controladamente sem tirar o quadril do banco.', proTip: 'Não estenda totalmente os joelhos no topo (bloqueio).', muscles: { primary: ['Quadríceps'], secondary: ['Glúteos'] } },
            { id: 'g_lg_3', name: 'Cadeira Extensora', muscle: 'Pernas', sets: 3, reps: '12-15', tier: 3, howTo: 'Sente-se bem apoiado e estenda as pernas focando na contração do quadríceps.', proTip: 'Segure 1 segundo no topo para máxima contração.', muscles: { primary: ['Quadríceps'] } },
            { id: 'g_lg_4', name: 'Mesa Flexora', muscle: 'Pernas', sets: 3, reps: '10-12', tier: 3, howTo: 'Deitado, flexione os joelhos trazendo o rolo em direção ao glúteo.', proTip: 'Mantenha o quadril colado no banco durante o movimento.', muscles: { primary: ['Isquiotibiais'] } },
            { id: 'g_lg_5', name: 'Stiff (Barra)', muscle: 'Pernas', sets: 4, reps: '10', tier: 1, howTo: 'Pernas quase estendidas, desça a barra rente às pernas jogando o quadril para trás.', proTip: 'Sinta o alongamento dos posteriores, não use a lombar.', muscles: { primary: ['Isquiotibiais', 'Glúteo'], secondary: ['Eretores da Espinha'] } },
            { id: 'g_lg_6', name: 'Elevação Pélvica', muscle: 'Pernas', sets: 4, reps: '10-12', tier: 1, howTo: 'Costas apoiadas no banco, barra no quadril, suba o peso contraindo os glúteos ao máximo.', proTip: 'Faça uma pausa de 2 segundos no topo.', muscles: { primary: ['Glúteo Máximo'], secondary: ['Isquiotibiais'] } },
            { id: 'g_lg_7', name: 'Cadeira Abdutora', muscle: 'Pernas', sets: 3, reps: '15', tier: 3, howTo: 'Afaste as pernas contra a resistência, focando no glúteo médio.', proTip: 'Incline o tronco levemente para frente para maior ativação.', muscles: { primary: ['Glúteo Médio', 'Tensor da Fáscia Lata'] } },
            { id: 'g_lg_8', name: 'Panturrilha Sentado', muscle: 'Pernas', sets: 4, reps: '15-20', tier: 3, howTo: 'Eleve o peso na ponta dos pés, alongando bem na descida.', proTip: 'A pausa no ponto de maior alongamento ajuda a quebrar o reflexo elástico.', muscles: { primary: ['Panturrilha'] } },
            { id: 'g_lg_9', name: 'Agachamento Búlgaro', muscle: 'Pernas', sets: 3, reps: '10', tier: 1, howTo: 'Pé traseiro apoiado num banco atrás, desça o joelho da perna traseira em direção ao chão mantendo o tronco reto.', proTip: 'Um dos exercícios unilaterais mais eficientes. Carregue com halteres nas mãos para progredir.', muscles: { primary: ['Quadríceps', 'Glúteos'], secondary: ['Isquiotibiais'] } },
            { id: 'g_lg_10', name: 'Agachamento Hack', muscle: 'Pernas', sets: 4, reps: '10-12', tier: 1, howTo: 'Na máquina, posicione os pés mais à frente na plataforma e agache profundamente com controle.', proTip: 'Ideal para isolar o quadríceps com menor sobrecarga na coluna.', muscles: { primary: ['Quadríceps'], secondary: ['Glúteos'] } },
            { id: 'g_lg_11', name: 'Terra Romeno (Halter)', muscle: 'Pernas', sets: 4, reps: '10-12', tier: 1, howTo: 'Segure os halteres na frente das coxas, desça jogando o quadril para trás mantendo as pernas quase estendidas.', proTip: 'Foco no alongamento e contração dos isquiotibiais, não na carga máxima.', muscles: { primary: ['Isquiotibiais', 'Glúteos'], secondary: ['Lombar'] } },
            { id: 'g_lg_12', name: 'Afundo Caminhando', muscle: 'Pernas', sets: 3, reps: '12', tier: 2, howTo: 'Avance alternando as pernas, descendo o joelho traseiro próximo ao chão e empurrando para subir.', proTip: 'Ótimo para simetria entre os lados e melhora do equilíbrio dinâmico.', muscles: { primary: ['Quadríceps', 'Glúteos'], secondary: ['Abdômen'] } },
            { id: 'g_lg_13', name: 'Agachamento Sumô', muscle: 'Pernas', sets: 4, reps: '10-12', tier: 1, howTo: 'Pés muito abertos com pontas voltadas para fora, desça mantendo o joelho alinhado com os pés.', proTip: 'Ativa mais o glúteo médio e os adutores do que o agachamento convencional.', muscles: { primary: ['Glúteos', 'Adutor'], secondary: ['Quadríceps'] } }
        ],
        triceps: [
            { id: 'g_tr_1', name: 'Tríceps Pulley', muscle: 'Tríceps', sets: 3, reps: '12-15', tier: 3, howTo: 'Cotovelos fixos ao lado do corpo, estenda os braços puxando a barra para baixo.', proTip: 'Mantenha os ombros relaxados e longe das orelhas.', muscles: { primary: ['Tríceps Braquial'] } },
            { id: 'g_tr_2', name: 'Tríceps Testa', muscle: 'Tríceps', sets: 3, reps: '10-12', tier: 2, howTo: 'Deitado, desça a barra ou halteres em direção à testa, mantendo os cotovelos paralelos.', proTip: 'Foco na porção longa do tríceps.', muscles: { primary: ['Tríceps (Cabeça Longa)'] } },
            { id: 'g_tr_3', name: 'Tríceps Corda', muscle: 'Tríceps', sets: 3, reps: '15', tier: 3, howTo: 'Abra a corda no final da extensão para maior pico de contração.', proTip: 'Não use o corpo para dar embalo.', muscles: { primary: ['Tríceps (Cabeça Lateral)'] } },
            { id: 'g_tr_4', name: 'Mergulho Paralelas', muscle: 'Tríceps', sets: 3, reps: 'Máx', tier: 1, howTo: 'Corpo vertical, desça controladamente e suba focando na força do braço.', proTip: 'Incline menos o tronco para focar no tríceps e não no peito.', muscles: { primary: ['Tríceps Braquial'], secondary: ['Peitoral Inferior'] } },
            { id: 'g_tr_5', name: 'Tríceps Francês', muscle: 'Tríceps', sets: 3, reps: '10-12', tier: 2, howTo: 'Segure o halter com as duas mãos atrás da cabeça e estenda os braços para cima.', proTip: 'Foca na cabeça longa do tríceps, responsável pela maior parte do volume muscular do braço.', muscles: { primary: ['Tríceps (Cabeça Longa)'] } },
            { id: 'g_tr_6', name: 'Extensão de Tríceps Inclinado (Halter)', muscle: 'Tríceps', sets: 3, reps: '12-15', tier: 3, howTo: 'Inclinado com o tronco paralelo ao chão, mantenha o cotovelo fixo e estenda o braço para trás.', proTip: 'Foco total na contração de pico no final do movimento.', muscles: { primary: ['Tríceps (Cabeça Lateral)'] } }
        ],
        biceps: [
            { id: 'g_bi_1', name: 'Rosca Direta', muscle: 'Bíceps', sets: 3, reps: '10-12', tier: 2, howTo: 'Suba a barra em arco, sem mover os cotovelos para frente.', proTip: 'Evite o "roubo" com a lombar.', muscles: { primary: ['Bíceps Braquial'] } },
            { id: 'g_bi_3', name: 'Rosca Martelo', muscle: 'Bíceps', sets: 3, reps: '12', tier: 2, howTo: 'Pegada neutra (palmas para dentro), suba o halter mantendo o cotovelo fixo.', proTip: 'Excelente para desenvolver o braquiorradial (antebraço).', muscles: { primary: ['Braquial', 'Braquiorradial'] } },
            { id: 'g_bi_4', name: 'Rosca Scott', muscle: 'Bíceps', sets: 3, reps: '10', tier: 2, howTo: 'Apoie os braços no banco Scott e realize a rosca com amplitude completa.', proTip: 'Não estenda totalmente o braço para não sobrecarregar o tendão.', muscles: { primary: ['Bíceps Braquial (Braça Curta)'] } },
            { id: 'g_bi_5', name: 'Rosca Concentrada', muscle: 'Bíceps', sets: 3, reps: '12', tier: 3, howTo: 'Sentado, apoie o cotovelo na parte interna da coxa e faça a rosca.', proTip: 'Foco no pico do bíceps.', muscles: { primary: ['Bíceps Braquial'] } },
            { id: 'g_bi_6', name: 'Rosca Direta (Cabo)', muscle: 'Bíceps', sets: 3, reps: '12-15', tier: 3, howTo: 'Polia baixa, puxe a barra em arco mantendo os cotovelos fixos ao lado do corpo.', proTip: 'O cabo mantém tensão constante em toda a amplitude, diferente dos halteres.', muscles: { primary: ['Bíceps Braquial'] } },
            { id: 'g_bi_7', name: 'Rosca Inclinada (Halter)', muscle: 'Bíceps', sets: 3, reps: '10-12', tier: 2, howTo: 'Deitado no banco inclinado (45°), deixe os braços pendurados e realize a rosca.', proTip: 'A posição inclinada cria pré-alongamento do bíceps, maximizando o recrutamento muscular.', muscles: { primary: ['Bíceps Braquial (Cabeça Longa)'] } }
        ],
        core: [
            { id: 'g_co_1', name: 'Abdominal Polia', muscle: 'Abdômen', sets: 4, reps: '15-20', tier: 3, howTo: 'Ajoelhado, segure a corda acima da cabeça e "enrole" o tronco em direção ao chão.', proTip: 'O movimento deve ser de enrolar a coluna, não de dobrar o quadril.', muscles: { primary: ['Reto Abdominal'] } },
            { id: 'g_co_2', name: 'Elevação de Pernas', muscle: 'Abdômen', sets: 4, reps: '15', tier: 2, howTo: 'Suspenso ou deitado, eleve as pernas até formar um ângulo de 90 graus.', proTip: 'Mantenha o movimento controlado na descida.', muscles: { primary: ['Infra Abdominal', 'Flexores do Quadril'] } },
            { id: 'g_co_3', name: 'Prancha Isométrica', muscle: 'Abdômen', sets: 3, reps: '60s', tier: 3, howTo: 'Corpo reto apoiado nos antebraços e pontas dos pés, mantenha a contração.', proTip: 'Não deixe o quadril cair nem subir demais.', muscles: { primary: ['Transverso do Abdômen', 'Abdômen'] } },
            { id: 'g_co_4', name: 'Roda Abdominal', muscle: 'Abdômen', sets: 3, reps: '10', tier: 1, howTo: 'Ajoelhado com a roda no chão, estenda o corpo para frente de forma controlada e retorne puxando o core.', proTip: 'Um dos exercícios mais eficientes para o core. Comece com amplitude parcial se necessário.', muscles: { primary: ['Reto Abdominal', 'Abdômen'], secondary: ['Ombros'] } },
            { id: 'g_co_5', name: 'Abdominal Declinado', muscle: 'Abdômen', sets: 4, reps: '15-20', tier: 2, howTo: 'No banco declinado, suba o tronco de forma controlada até 45 graus.', proTip: 'Adicione uma anilha no peito para progredir com sobrecarga.', muscles: { primary: ['Reto Abdominal'] } }
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
            { id: 'h_sh_1', name: 'Flexão em V', muscle: 'Ombros', sets: 3, reps: '10', tier: 1, howTo: 'Posição de V invertido, desça a cabeça em direção ao chão e empurre para cima.', proTip: 'Quanto mais vertical o corpo, mais pesado fica para o ombro.', muscles: { primary: ['Ombros'], secondary: ['Tríceps'] } },
            { id: 'h_sh_2', name: 'Elevação Lateral (Halter)', muscle: 'Ombros', sets: 3, reps: '15', tier: 3, howTo: 'Suba os pesos lateralmente até a altura dos ombros.', proTip: 'Pode usar garrafas de água como peso.', muscles: { primary: ['Deltoide Lateral'] } },
            { id: 'h_sh_3', name: 'Desenvolvimento (Halter)', muscle: 'Ombros', sets: 3, reps: '12', tier: 1, howTo: 'Empurre a carga para cima acima da cabeça.', proTip: 'Mantenha as costas retas, se puder sente em uma cadeira com encosto.', muscles: { primary: ['Ombros'], secondary: ['Tríceps'] } }
        ],
        legs: [
            { id: 'h_lg_1', name: 'Agachamento Taça', muscle: 'Pernas', sets: 4, reps: '15', tier: 1, howTo: 'Segure o peso junto ao peito e agache mantendo a postura ereta.', proTip: 'Mantenha os cotovelos por dentro dos joelhos no fundo do agachamento.', muscles: { primary: ['Quadríceps'] } },
            { id: 'h_lg_2', name: 'Afundo', muscle: 'Pernas', sets: 3, reps: '12', tier: 1, howTo: 'Dê um passo à frente e desça o joelho de trás em direção ao chão.', proTip: 'Mantenha o tronco reto para focar no quadríceps.', muscles: { primary: ['Quadríceps', 'Glúteos'] } },
            { id: 'h_lg_3', name: 'Elevação Pélvica Solo', muscle: 'Pernas', sets: 4, reps: '20', tier: 2, howTo: 'Deitado, suba o quadril contraindo os glúteos.', proTip: 'Coloque um peso sobre a pelve para aumentar a dificuldade.', muscles: { primary: ['Glúteos'], secondary: ['Isquiotibiais'] } },
            { id: 'h_lg_4', name: 'Agachamento Pistola (Com Apoio)', muscle: 'Pernas', sets: 3, reps: '8', tier: 1, howTo: 'Agachamento unilateral com uma perna estendida para frente, use apoio se necessário.', proTip: 'Exercício de alto nível para força e equilíbrio.', muscles: { primary: ['Quadríceps', 'Glúteos'] } }
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
            { id: 'h_co_1', name: 'Escaladores', muscle: 'Abdômen', sets: 4, reps: '45s', tier: 3, howTo: 'Posição de flexão, traga os joelhos em direção ao peito em ritmo acelerado.', proTip: 'Mantenha o quadril baixo e o core travado.', muscles: { primary: ['Abdômen'] } },
            { id: 'h_co_2', name: 'Abdominal Supra', muscle: 'Abdômen', sets: 4, reps: '20', tier: 3, howTo: 'Deitado, contraia o abdômen tirando apenas as escápulas do chão.', proTip: 'Não puxe o pescoço com as mãos.', muscles: { primary: ['Abs'] } },
            { id: 'h_co_3', name: 'Prancha Lateral', muscle: 'Abdômen', sets: 3, reps: '30s', tier: 3, howTo: 'Apoie-se em um antebraço de lado e mantenha o corpo alinhado.', proTip: 'Trabalha intensamente os oblíquos.', muscles: { primary: ['Abdômen', 'Oblíquos'] } }
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
            { id: 'c_bk_2', name: 'Extensão Dorsal Isométrica', muscle: 'Costas', sets: 4, reps: '30s', tier: 1, howTo: 'Deitado de bruços, eleve braços e pernas simultaneamente e segure.', proTip: 'Mantenha o olhar para o chão para não sobrecarregar o pescoço.', muscles: { primary: ['Eretores da Espinha'] } },
            { id: 'c_bk_3', name: 'Barra Fixa (Opcional)', muscle: 'Costas', sets: 4, reps: 'Máx', tier: 1, howTo: 'Se tiver acesso a uma barra, realize barras completas.', proTip: 'Totalmente bodyweight.', muscles: { primary: ['Costas'], secondary: ['Bíceps'] } }
        ],
        shoulders: [
            { id: 'c_sh_1', name: 'Flexão em V', muscle: 'Ombros', sets: 3, reps: '10', tier: 1, howTo: 'Quadril elevado em V, desça a cabeça em direção ao chão.', proTip: 'Foco total no deltoide frontal.', muscles: { primary: ['Ombros'], secondary: ['Tríceps'] } },
            { id: 'c_sh_2', name: 'Prancha Dinâmica', muscle: 'Ombros', sets: 3, reps: '12', tier: 2, howTo: 'Alternar entre prancha baixa (cotovelos) e prancha alta (mãos).', proTip: 'Estabilize bem o quadril durante a transição.', muscles: { primary: ['Ombros', 'Abdômen'] } }
        ],
        legs: [
            { id: 'c_lg_1', name: 'Agachamento Livre', muscle: 'Pernas', sets: 4, reps: '20', tier: 1, howTo: 'Agache profundamente mantendo o calcanhar no chão.', proTip: 'Mantenha o tronco o mais vertical possível.', muscles: { primary: ['Quadríceps', 'Glúteo'] } },
            { id: 'c_lg_2', name: 'Afundo', muscle: 'Pernas', sets: 3, reps: '15', tier: 1, howTo: 'Dê um passo à frente e desça o joelho traseiro.', proTip: 'Amplitude máxima para ativação do glúteo.', muscles: { primary: ['Quadríceps', 'Glúteos'] } },
            { id: 'c_lg_3', name: 'Elevação Pélvica Solo', muscle: 'Pernas', sets: 4, reps: '20', tier: 2, howTo: 'Deitado, suba o quadril contraindo os glúteos ao máximo.', proTip: 'Segure 2 segundos no topo.', muscles: { primary: ['Glúteos'] } },
            { id: 'c_lg_4', name: 'Agachamento Pistola (Com Apoio)', muscle: 'Pernas', sets: 3, reps: '8', tier: 1, howTo: 'Agachamento unilateral usando apoio se necessário.', proTip: 'O ápice da força de pernas no peso do corpo.', muscles: { primary: ['Quadríceps', 'Glúteos'] } }
        ],
        triceps: [
            { id: 'c_tr_1', name: 'Mergulho no Banco', muscle: 'Tríceps', sets: 3, reps: 'Máx', tier: 2, howTo: 'Apoie-se em uma cadeira atrás de você e realize o mergulho.', proTip: 'Mantenha os cotovelos apontados para trás.', muscles: { primary: ['Tríceps'] } },
            { id: 'c_tr_2', name: 'Flexão Fechada', muscle: 'Tríceps', sets: 3, reps: 'Máx', tier: 1, howTo: 'Mãos na largura dos ombros, cotovelos raspando nas costelas.', proTip: 'Extrema ativação da cabeça lateral do tríceps.', muscles: { primary: ['Tríceps'] } }
        ],
        biceps: [
            { id: 'c_bi_1', name: 'Rosca Inversa Dinâmica', muscle: 'Bíceps', sets: 3, reps: '15', tier: 3, howTo: 'Realize o movimento de rosca contraindo o bíceps ao máximo de forma isométrica atenuada.', proTip: 'Mantenha a mente no músculo.', muscles: { primary: ['Bíceps'] } }
        ],
        core: [
            { id: 'c_co_1', name: 'Escaladores', muscle: 'Abdômen', sets: 4, reps: '45s', tier: 3, howTo: 'Posição de prancha alta, traga os joelhos ao peito em velocidade.', proTip: 'Cardio e Core integrados.', muscles: { primary: ['Abdômen'] } },
            { id: 'c_co_2', name: 'Abdominal Supra', muscle: 'Abdômen', sets: 4, reps: '20', tier: 3, howTo: 'Curto e controlado, focando na parte superior do abdômen.', proTip: 'Sinta cada fibra contraindo.', muscles: { primary: ['Abs'] } },
            { id: 'c_co_3', name: 'Prancha Isométrica', muscle: 'Abdômen', sets: 3, reps: '60s', tier: 3, howTo: 'Corpo reto, antebraços no chão, segure a posição.', proTip: 'Respire fundo e mantenha o foco.', muscles: { primary: ['Abdômen'] } }
        ]
    }
};

export const SPLITS = {
    // ================================================================
    // FULL BODY INTENSO: 1 DIA - Para quem tem apenas 1 dia/semana
    // ================================================================
    // Estrutura: TODOS os grupos em UM ÚNICO dia
    // Frequência: 1x por semana (mínimo, mas funciona)
    // Volume: MUITO alto em um só dia
    // Duração: 90-120 minutos
    // Ideal para: Pessoas ocupadas, 1 dia disponível
    // ⚠️ Nota: Frequência 1x é menos ideal que 2x+
    //         Mas é melhor que não treinar
    //         Requer volume ALTO e técnica perfeita
    //
    // Estrutura do dia:
    // - 2 exercícios PUSH (Peito/Ombro/Tríceps)
    // - 2 exercícios PULL (Costas/Bíceps)
    // - 2 exercícios PERNAS (Quad/Posterior/Glúteo)
    // - 1 exercício CORE (Abdômen)
    // Total: ~8 exercícios em 1 dia
    //
    // Frequência real:
    // - Todos grupos: 1x/semana
    // - Volume: MÁXIMO concentrado
    full_body_1: {
        name: 'Full Body Intenso (1 dia)',
        description: 'Todos os grupos em 1 dia - para quem tem apenas 1 dia/semana',
        days: {
            1: ['chest', 'back', 'shoulders', 'legs', 'triceps', 'biceps', 'core']
        },
        default: ['chest', 'back', 'shoulders', 'legs', 'triceps', 'biceps', 'core']
    },

    // ================================================================
    // FULL BODY: 3 DIAS - Para iniciantes e pouco tempo disponível
    // ================================================================
    // Estrutura: Todos os grupos musculares em cada dia
    // Frequência: Máxima (3-4x por semana cada grupo)
    // Volume: Moderado por dia, distribuído
    // Ideal para: Iniciantes, sem muito tempo, ótima recuperação
    //
    // Dia 1 (Segunda): Peito, Costas, Pernas
    // Dia 2 (Quarta): Ombros, Pernas, Tríceps, Bíceps
    // Dia 3 (Sexta): Peito, Costas, Ombros, Core
    //
    // Frequência real:
    // - Peito: 2x (Seg, Sex)
    // - Costas: 2x (Seg, Sex)
    // - Pernas: 2x (Seg, Qua)
    // - Ombros: 2x (Qua, Sex)
    // - Tríceps: 1x (Qua) + estímulo passivo em Seg/Sex (peito)
    // - Bíceps: 1x (Qua) + estímulo passivo em Seg/Sex (costas)
    // - Core: 1x (Sex)
    full_body: {
        name: 'Full Body (3 dias)',
        description: 'Todos os grupos em cada treino - máxima frequência',
        days: {
            1: ['chest', 'back', 'legs'],
            3: ['shoulders', 'legs', 'triceps', 'biceps'],
            5: ['chest', 'back', 'shoulders', 'core']
        },
        default: ['chest', 'back', 'legs']
    },

    // ================================================================
    // 4 DIAS TRADICIONAL - Estrutura com descansos bem distribuídos
    // ================================================================
    // PRINCÍPIOS CIENTÍFICOS APLICADOS:
    // 1. DESCANSO ENTRE TREINOS: Não fazer 3+ dias consecutivos
    // 2. FREQUÊNCIA MUSCULAR: 1-2x por semana por grupo (ideal científico)
    // 3. RECUPERAÇÃO: 48-72h entre estímulos do mesmo grupo
    // 4. VOLUME: 10-20 séries por grupo por semana
    // 5. PADRÕES: Respeitar PUSH, PULL, LEGS para sinergia
    // 6. DISTRIBUIÇÃO: Balancear dias leves/moderados/pesados
    //
    // Estrutura: UPPER/LOWER alternado com descansos estratégicos
    //
    // Segunda: A (PUSH - Peito, Ombros, Tríceps)
    //   - Padrão de movimento: Empurrada horizontal/vertical
    //   - Volume: Moderado-alto
    //   - Recuperação até próximo PUSH: 3 dias (Sexta)
    //
    // Terça: DESCANSO
    //   - Essencial para recuperação após PUSH
    //   - Tempo para síntese proteica
    //
    // Quarta: B (PULL - Costas, Bíceps, Antebraço)
    //   - Padrão de movimento: Puxada horizontal/vertical
    //   - Volume: Moderado-alto
    //   - Recuperação até próximo PULL: 3 dias (Sábado)
    //
    // Quinta: DESCANSO
    //   - Recuperação do PULL
    //   - Preparação para legs (dia pesado)
    //
    // Sexta: C (LEGS - Pernas, Core)
    //   - Padrão de movimento: Extensão/flexão de joelho
    //   - Volume: MUITO alto (maior dispêndio energético)
    //   - Maior massa muscular = maior stimulus
    //   - Recuperação até próximo LEGS: 6 dias (próxima quarta)
    //
    // Sábado: D (UPPER 2 - Ombros, Braços, Complemento)
    //   - Ombro e Braços como complemento
    //   - Volume: Moderado
    //   - Frequência 2x para ombro/braços (ideal científico)
    //
    // Domingo: DESCANSO
    //   - Descanso total da semana
    //
    // FREQUÊNCIA REAL (ideal científico):
    // - Peito: 1x (Seg) ✓
    // - Costas: 1x (Qua) ✓
    // - Ombros: 2x (Seg primário, Sab complemento) ✓✓
    // - Pernas: 1x (Sex) ✓
    // - Tríceps: 2x (Seg primário, Sab complemento) ✓✓
    // - Bíceps: 1x (Qua) ✓
    // - Core: 1x (Sex) ✓
    //
    // DISTRIBUIÇÃO DE DESCANSO:
    // - Após PUSH (Seg): 1 dia antes próximo treino
    // - Após PULL (Qua): 1 dia antes próximo treino
    // - Após LEGS (Sex): 2 dias antes próximo treino (mais pesado)
    // - Intervalo mínimo entre grupos: 48-72h ✓
    //
    // PRINCÍPIO DE RECUPERAÇÃO:
    // Cada grupo muscular tem MÍNIMO 2 dias de descanso completo
    // antes de ser estimulado novamente
    traditional_4: {
        name: '4 Dias Tradicional',
        description: 'Descansos distribuídos - PUSH, PULL, LEGS com frequência 2x para ombro/braços',
        days: {
            1: ['chest', 'shoulders', 'triceps'],              // Segunda: PUSH A (frequência 1x peito, 2x ombro/tri)
            2: [],                                              // Terça: DESCANSO (recuperação)
            3: ['back', 'biceps', 'forearms'],                 // Quarta: PULL (frequência 1x)
            4: [],                                              // Quinta: DESCANSO (antes dia pesado)
            5: ['legs', 'core'],                               // Sexta: LEGS (volume MÁXIMO - dia mais pesado)
            6: ['shoulders', 'triceps']                        // Sábado: UPPER 2 (complemento + frequência 2x)
        },
        default: ['chest', 'back', 'legs']
    },

    // ================================================================
    // ABC (3 PADRÕES) - 3 ou 6 dias conforme frequência desejada
    // ================================================================
    // Estrutura: Padrões de movimento (PUSH / PULL / LEGS)
    // Frequência: 1x/semana (3 dias) ou 2x/semana (6 dias)
    // Volume: Distribuído por padrão funcional
    // Ideal para: Intermediários, lógica científica clara
    //
    // PADRÃO A - PUSH (Empurrar):
    //   Primário: Peito, Ombros Anterior
    //   Secundário: Tríceps
    //
    // PADRÃO B - PULL (Puxar):
    //   Primário: Costas (Dorsal, Romboides), Ombros Posterior
    //   Secundário: Bíceps, Antebraço
    //
    // PADRÃO C - LEGS (Pernas):
    //   Primário: Quadríceps, Isquiotibiais, Glúteos
    //   Secundário: Panturrilha, Core
    //
    // VERSÃO 3 DIAS (1x por semana cada grupo):
    // Seg: A - PUSH
    // Qua: B - PULL
    // Sex: C - LEGS
    //
    // VERSÃO 6 DIAS (2x por semana cada grupo - FREQUÊNCIA ÓTIMA):
    // Seg: A1 - PUSH (variante 1)
    // Ter: B1 - PULL (variante 1)
    // Qua: C1 - LEGS (variante 1)
    // Qui: A2 - PUSH (variante 2)
    // Sex: B2 - PULL (variante 2)
    // Sab: C2 - LEGS (variante 2)
    abc_3: {
        name: 'ABC (3 dias)',
        description: 'Push / Pull / Legs - 1x/semana, descansos estratégicos',
        days: {
            1: ['chest', 'shoulders', 'triceps'],             // Segunda: A - PUSH
            2: [],                                             // Terça: Descanso
            3: ['back', 'biceps', 'forearms'],                // Quarta: B - PULL
            4: [],                                             // Quinta: Descanso
            5: ['legs', 'core']                               // Sexta: C - LEGS
        },
        default: ['chest', 'back', 'legs']
    },

    abc_6: {
        name: 'ABC (6 dias)',
        description: 'Push / Pull / Legs 2x por semana - frequência ótima',
        days: {
            1: ['chest', 'shoulders', 'triceps'],             // A1 - PUSH
            2: ['back', 'biceps', 'forearms'],                // B1 - PULL
            3: ['legs', 'core'],                              // C1 - LEGS
            4: ['chest', 'shoulders', 'triceps'],             // A2 - PUSH (variado)
            5: ['back', 'biceps', 'forearms'],                // B2 - PULL (variado)
            6: ['legs', 'core']                               // C2 - LEGS (variado)
        },
        default: ['chest', 'shoulders', 'triceps']
    },

    // ================================================================
    // PPL (PUSH / PULL / LEGS) - 6 DIAS - Frequência ótima
    // ================================================================
    // Estrutura: 3 padrões de movimento repetidos 2x por semana
    // Frequência: 2x por semana cada grupo (IDEAL para hipertrofia)
    // Volume: Máximo sustentável
    // Ideal para: Avançados, muito tempo para treino, boa recuperação
    //
    // Dia 1 (Segunda): PUSH A (Peito, Ombros, Tríceps)
    // Dia 2 (Terça): PULL A (Costas, Bíceps, Antebraço)
    // Dia 3 (Quarta): LEGS A (Pernas, Glúteos, Core)
    // Dia 4 (Quinta): PUSH B (Peito, Ombros, Tríceps - variação)
    // Dia 5 (Sexta): PULL B (Costas, Bíceps, Antebraço - variação)
    // Dia 6 (Sábado): LEGS B (Pernas, Glúteos, Core - variação)
    //
    // Frequência real:
    // - Peito: 2x (PUSH A, PUSH B)
    // - Ombros: 2x (PUSH A, PUSH B)
    // - Tríceps: 2x (PUSH A, PUSH B)
    // - Costas: 2x (PULL A, PULL B)
    // - Bíceps: 2x (PULL A, PULL B)
    // - Antebraço: 2x (PULL A, PULL B)
    // - Pernas: 2x (LEGS A, LEGS B)
    // - Glúteos: 2x (LEGS A, LEGS B)
    // - Core: 2x (LEGS A, LEGS B)
    ppl: {
        name: 'PPL (6 dias)',
        description: 'Push / Pull / Legs 2x/semana - frequência e volume ótimos',
        days: {
            1: ['chest', 'shoulders', 'triceps'],             // PUSH A
            2: ['back', 'biceps', 'forearms'],                // PULL A
            3: ['legs', 'core'],                              // LEGS A
            4: ['chest', 'shoulders', 'triceps'],             // PUSH B (variado)
            5: ['back', 'biceps', 'forearms'],                // PULL B (variado)
            6: ['legs', 'core']                               // LEGS B (variado)
        },
        default: ['chest', 'shoulders', 'triceps']
    },

    // ================================================================
    // AB (2 PADRÕES) - 2, 3 ou 4 dias conforme frequência
    // ================================================================
    // Estrutura: 2 blocos alternados (A - PUSH/UPPER, B - PULL/LOWER)
    // Frequência: Variável conforme dias
    // Volume: Distribuído entre 2 blocos
    // Ideal para: Iniciantes com 2-4 dias, simplicidade
    //
    // BLOCO A: Peito, Ombros, Tríceps + Pernas/Core alternado
    // BLOCO B: Costas, Bíceps, Antebraço + Pernas/Core alternado
    ab_2: {
        name: 'AB (2 dias)',
        description: 'UPPER/LOWER - Frequência 1x, separados por 2-3 dias',
        days: {
            1: ['chest', 'shoulders', 'triceps', 'back', 'biceps', 'forearms'],  // Segunda: UPPER (PUSH + PULL)
            2: [],                                                                 // Terça: Descanso (recuperação)
            3: ['legs', 'core'],                                                  // Quarta: LOWER (Pernas + Core)
            4: [],                                                                 // Quinta-Domingo: Descanso
            5: [],
            6: [],
            7: []
        },
        default: ['chest', 'back', 'legs']
    },

    ab_4: {
        name: 'AB (4 dias)',
        description: 'UPPER/LOWER 2x - com descansos distribuídos',
        days: {
            1: ['chest', 'shoulders', 'triceps'],             // Segunda: UPPER A - PUSH
            2: [],                                             // Terça: DESCANSO
            3: ['back', 'biceps', 'forearms'],                // Quarta: LOWER A - PULL
            4: [],                                             // Quinta: DESCANSO
            5: ['legs', 'core'],                              // Sexta: LEGS
            6: ['chest', 'shoulders', 'triceps', 'back', 'biceps'] // Sábado: UPPER B + complemento
        },
        default: ['chest', 'back', 'legs']
    },

    // ================================================================
    // ABCD (4 PADRÕES) - 4, 5 ou 6+ dias
    // ================================================================
    // Estrutura: 4 blocos específicos (muito segmentado)
    // Frequência: 1x por semana cada grupo
    // Volume: MUITO alto por dia
    // Ideal para: Avançados, especialização, volume extremo
    //
    // Dia A: Peito (volume MUITO alto)
    // Dia B: Costas (volume MUITO alto)
    // Dia C: Pernas (volume MUITO alto)
    // Dia D: Ombros + Braços (volume MUITO alto)
    abcd_4: {
        name: 'ABCD (4 dias)',
        description: 'Um grupo por dia - Peito, Costas, Pernas, Ombros+Braços',
        days: {
            1: ['chest'],                                     // A - PEITO
            2: ['back', 'biceps'],                            // B - COSTAS + BÍCEPS
            3: ['legs'],                                      // C - PERNAS
            4: ['shoulders', 'triceps', 'forearms']           // D - OMBROS + TRÍCEPS + ANTEBRAÇO
        },
        default: ['chest']
    },

    // ================================================================
    // BRO SPLIT (5 DIAS) - Frequência baixa, volume MUITO alto
    // ================================================================
    // Estrutura: Um grupo muscular por dia (clássico)
    // Frequência: 1x por semana cada grupo
    // Volume: MÁXIMO sustentável
    // Ideal para: Avançados experientes, preferência pessoal, foco muscular
    // ⚠️ MENOS CIENTÍFICO que ABC/PPL (frequência 1x é menos ideal)
    // ⚠️ Recomenda-se ABC 3x ou PPL para resultados melhores
    //
    // Dia 1 (Seg): Peito - MUITO alto volume
    // Dia 2 (Ter): Costas - MUITO alto volume
    // Dia 3 (Qua): Pernas - MUITO alto volume
    // Dia 4 (Qui): Ombros - MUITO alto volume
    // Dia 5 (Sex): Braços (Bíceps + Tríceps) - MUITO alto volume
    // Dias 6-7: Descanso
    bro_split: {
        name: 'Bro Split (5 dias)',
        description: '⚠️ 1 grupo/dia (frequência 1x) - Volume MUITO alto',
        days: {
            1: ['chest'],                                     // Seg: PEITO
            2: ['back'],                                      // Ter: COSTAS
            3: ['legs'],                                      // Qua: PERNAS
            4: ['shoulders'],                                 // Qui: OMBROS
            5: ['biceps', 'triceps']                          // Sex: BRAÇOS
        },
        default: ['chest']
    }
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

    // DISTRIBUIR EXERCÍCIOS ENTRE OS GRUPOS MUSCULARES
    // Calcula quantos exercícios cada grupo deve receber
    const exercisesPerMuscle = Math.ceil(targetTotal / muscles.length);

    for (const muscle of muscles) {
        let exercisesForMuscle = [...(EXERCISES[location][muscle] || [])];
        // Ordenar por tier (1 = mais importante, depois 2, depois 3)
        exercisesForMuscle.sort((a, b) => (a.tier || 3) - (b.tier || 3));

        // Adicionar os exercícios deste grupo muscular (respeitando a cota por grupo)
        let addedForThisMuscle = 0;
        for (const exercise of exercisesForMuscle) {
            if (workout.length < targetTotal && addedForThisMuscle < exercisesPerMuscle) {
                workout.push(exercise);
                addedForThisMuscle++;
            }
        }

        if (workout.length >= targetTotal) break;
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
    core: 'Abdômen',
    forearms: 'Antebraços'
};

export function generateWeeklyPlan(profile) {
    const days = [1, 2, 3, 4, 5, 6, 7];

    // Mapear selectedSplit (ex: "4d") para o ID do split correspondente
    // Fallback para freq se selectedSplit não existir
    let splitKey = null;
    if (profile.selectedSplit) {
        // Mapeamento de selectedSplit para splitKey
        const splitMap = {
            '1d': 'full_body_1', '2d': 'ab_2', '3d': 'ppl_3',
            '4d': 'upper_lower_4', '5d': 'ppl_5', '6d': 'upper_lower_6', '7d': 'ppl_7'
        };
        splitKey = splitMap[profile.selectedSplit] || 'full_body_1';
    } else {
        // Fallback antigo (compatibilidade)
        splitKey = profile.freq ? `split_${profile.freq}` : 'full_body_1';
    }

    const split = SPLITS[splitKey];
    if (!split) {
        console.warn(`Split ${splitKey} não encontrado, usando full_body_1`);
        splitKey = 'full_body_1';
    }

    return days.map(day => {
        let muscles = SPLITS[splitKey]?.days?.[day] || [];
        
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
