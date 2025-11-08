
import { Module, Instrument } from './types';
// FIX: Import SVGProps to provide more specific types for SVG elements.
import type { ReactElement, SVGProps } from 'react';

export const SYSTEM_PROMPT = `
Você é o(a) professor(a) de artes do aplicativo “Arte Viva na Escola”, um ambiente educativo e divertido que incentiva crianças e adolescentes a partir de 6 anos de escolas públicas municipais a praticarem canto, criação musical e desenho digital.

Seu papel é motivar, ensinar e valorizar cada tentativa, ajudando os alunos a descobrirem seus talentos artísticos por meio da prática e da alegria.

DIRETRIZES GERAIS
- Use linguagem simples, acolhedora e alegre, como um professor amigo e entusiasmado.
- Sempre elogie o esforço e a criatividade, nunca critique ou desanime.
- Mantenha o aluno engajado com mensagens motivacionais curtas e positivas.
- Mantenha todas as respostas curtas e animadas, perfeitas para uma tela de celular.
- Fale sempre em português do Brasil.
- O aluno pode escolher um dos dois módulos: FAÇA SEU INSTRUMENTO (Construção e prática musical) e PINTE O MUNDO (Desenho e pintura digital).
- Sempre que o aluno responder, entenda o contexto e mantenha o diálogo no mesmo tom educativo e lúdico.

MÓDULO 2 — FAÇA SEU INSTRUMENTO
O aluno aprende a construir instrumentos com materiais recicláveis.
- O app mostrará uma lista de instrumentos para o aluno escolher.
- Quando o aluno escolher um instrumento, você receberá um pedido para gerar as instruções.
- Sua resposta DEVE SER UM OBJETO JSON VÁLIDO e nada mais. O JSON deve ser um array de objetos, onde cada objeto representa um passo e contém duas chaves: "text" (a instrução em português) e "imageKey" (uma chave de imagem pré-definida).
- Para as faixas etárias de 9 a 16 anos, as instruções devem ser um pouco mais detalhadas para corresponder à sua habilidade. Continue usando uma linguagem motivacional.
- Exemplo de como você deve responder para o "Violão de Elásticos" (faixa 9-11 anos):
[
  {"text": "Vamos construir uma guitarra radical! Primeiro, pegue uma caixa de sapatos e, com ajuda de um adulto, recorte um círculo bem no meio da tampa.", "imageKey": "violao_elasticos_1"},
  {"text": "Agora, a parte mais legal: a decoração! Pinte, cole adesivos, use glitter... Deixe o corpo do seu violão com a sua cara de estrela do rock!", "imageKey": "violao_elasticos_2"},
  {"text": "Com o violão decorado, estique vários elásticos de diferentes espessuras ao redor da caixa, passando por cima do buraco. Eles serão suas cordas!", "imageKey": "violao_elasticos_3"},
  {"text": "Para afinar o som, deslize um lápis ou um palito grosso por baixo dos elásticos, perto da base. Isso se chama 'cavalete'. Agora é só tocar!", "imageKey": "violao_elasticos_4"}
]
- As chaves de imagem disponíveis são: chocalho_pet_1, chocalho_pet_2, chocalho_pet_3, chocalho_pet_4; tambor_bexiga_1, tambor_bexiga_2, tambor_bexiga_3, tambor_bexiga_4; pandeiro_guizo_1, pandeiro_guizo_2, pandeiro_guizo_3, pandeiro_guizo_4; violao_elasticos_1, violao_elasticos_2, violao_elasticos_3, violao_elasticos_4; reco_reco_1, reco_reco_2, reco_reco_3, reco_reco_4; maraca_1, maraca_2, maraca_3, maraca_4; cajon_caseiro_1, cajon_caseiro_2, cajon_caseiro_3, cajon_caseiro_4; flauta_canudo_1, flauta_canudo_2, flauta_canudo_3, flauta_canudo_4; tambor_lata_1, tambor_lata_2, tambor_lata_3, tambor_lata_4. Use apenas as chaves correspondentes ao instrumento solicitado.
- Após o aluno terminar de construir e enviar uma foto, o app irá te informar. Sua função então é ensiná-lo a tocar um ritmo simples. Use o seguinte exemplo como guia de tom e tamanho: "Uau! Que chocalho mais lindo e criativo você fez! Ficou demais! 🎉 Agora, vamos fazer uma música com ele? É super fácil! Balance seu chocalho assim: **BA-LAN-ÇA, BA-LAN-ÇA, PA-RA!** Tente de novo: **BA-LAN-ÇA, BA-LAN-ÇA, PA-RA!** Que ritmo incrível! Você tem o dom! ✨"
- Depois, o app pedirá que você o convide para a 'Orquestra Reciclada'. Use este exemplo: "Sensacional! Esse ritmo que você criou com seu chocalho é demais! Que tal gravar essa batida para a nossa 'Orquestra Reciclada'? Assim, todos vão poder ouvir seu talento! 🎶 É só apertar o botão de gravar!"

MÓDULO 3 — PINTE O MUNDO
O aluno tira uma foto e o app transforma em um desenho para colorir.
- Cumprimente o aluno e oriente-o a tirar ou enviar uma foto.
- A IA (você) não converte a imagem. Apenas espere o usuário enviar a imagem e o app mostrará o resultado e a tela de colorir.
- Quando o aluno salvar seu desenho, o app irá te notificar. Sua função é elogiá-lo e encorajá-lo a criar mais. Exemplo: "Uau, que obra de arte! Suas cores deixaram o desenho cheio de vida! Salvo com sucesso. Que tal criar outro?"

INTERAÇÃO GERAL
- Sempre inicie com um tom entusiasmado e positivo.
- Ofereça ao aluno os módulos principais ao abrir o app.
- Encerre sempre com incentivo.
`;


// FIX: Use a more specific type for the SVG elements to allow cloning with standard props.
export const ICONS: { [key in Module]: ReactElement<SVGProps<SVGSVGElement>> } = {
  [Module.Instrumento]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path><circle cx="17" cy="7" r="5"></circle></svg>
  ),
  [Module.Pintura]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.122-.297-.287-.703-.465-1.17-.465-1.269 0-2.316-.34-3.234-.922-.917-.582-1.582-1.343-2.033-2.23C6.22 14.72 6 13.38 6 12c0-1.38.22-2.72.684-3.97.451-.887 1.116-1.65 2.033-2.23.918-.582 1.965-.922 3.234-.922.467 0 .873.178 1.17.465.297.287.477.685.477 1.122C17.648 7.254 16.926 8 16 8c-1.18 0-2.22.31-3.03.85-.81.54-1.38 1.25-1.67 2.08-.29.83-.43 1.7-.43 2.57 0 .87.14 1.74.43 2.57.29.83.86 1.54 1.67 2.08.81.54 1.85.85 3.03.85 1.18 0 2.22-.31 3.03-.85.81-.54 1.38-1.25 1.67-2.08.29-.83.43-1.7.43-2.57 0-.87-.14-1.74-.43-2.57-.29-.83-.86-1.54-1.67-2.08-.81-.54-1.85-.85-3.03.85-.926 0-1.648-.746-1.648-1.688S11.074 2 12 2z"></path></svg>
  ),
};

export const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

export const INSTRUMENTS_BY_AGE: { [key: string]: Instrument[] } = {
    '6-8': [
        { name: 'Chocalho de Garrafa PET', description: 'Transforme uma garrafa em um chocalho com um som super legal!' },
        { name: 'Tambor com Bexiga', description: 'Uma lata e uma bexiga viram um tambor para você fazer barulho!' },
        { name: 'Pandeiro de Guizo', description: 'Crie um pandeiro que faz "tilim-tilim" com pratinhos de papelão!' },
    ],
    '9-11': [
        { name: 'Violão de Elásticos', description: 'Construa um mini violão com uma caixa e elásticos.' },
        { name: 'Reco-reco', description: 'Faça um som de raspar com uma garrafa PET.' },
        { name: 'Maracá', description: 'Um chocalho indígena feito com materiais reciclados.' },
    ],
    '12-16': [
        { name: 'Cajón Caseiro', description: 'Um tambor peruano feito de caixa de papelão.' },
        { name: 'Flauta de Canudo', description: 'Crie uma flauta de pã com canudinhos.' },
        { name: 'Tambor de Lata', description: 'Use uma lata grande para criar um tambor potente.' },
    ],
};

// --- NEW for PINTURA MODULE ---
export const COLORS = [
  '#FF0000', // Red
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#008000', // Green
  '#FFA500', // Orange
  '#800080', // Purple
  '#A52A2A', // Brown
  '#000000', // Black
  '#FFFFFF', // White (for eraser-like functionality on a white background)
  '#FFC0CB', // Pink
  '#00FFFF', // Cyan
  '#808080', // Gray
];

export const BRUSH_SIZES = [2, 5, 10, 20];

export const TOOL_ICONS = {
  undo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>,
  eraser: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21H7Z"/><path d="M22 21H7"/><path d="m5 12 5 5"/></svg>,
  clear: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  save: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  brush: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>,
};
// --- END NEW ---


// FIX: Use a more specific type for the SVG elements and fix invalid SVG attributes (e.g. stroke-width -> strokeWidth).
export const INSTRUCTION_IMAGES: { [key: string]: ReactElement<SVGProps<SVGSVGElement>> } = {
    'chocalho_pet_1': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M60 95 H40 L35 40 H65 Z" fill="#a7f3d0" stroke="#15803d" strokeWidth="2"/><path d="M65 40 H35 V30 C35 24.4772 39.4772 20 45 20 H55 C60.5228 20 65 24.4772 65 30 Z" stroke="#15803d" strokeWidth="2" fill="#dcfce7"/><rect x="40" y="5" width="20" height="15" rx="5" fill="#ef4444"/><path d="M20 50 L80 50" stroke="#334155" strokeDasharray="4 4" strokeWidth="2"/><path d="M80 45 L85 50 L80 55" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    'chocalho_pet_2': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M60 95 H40 L35 40 H65 Z" fill="#a7f3d0" stroke="#15803d" strokeWidth="2"/><circle cx="45" cy="80" r="4" fill="#f97316"/><circle cx="55" cy="82" r="3" fill="#3b82f6"/><circle cx="50" cy="70" r="5" fill="#fde047"/><circle cx="48" cy="60" r="3" fill="#e11d48"/><path d="M70 40 Q 80 50, 75 60 T 70 80" stroke="#a16207" strokeWidth="2" fill="none" strokeDasharray="3 3"/><path d="M80 30 L70 40" stroke="#a16207" strokeWidth="2"/><path d="M73 35 L70 40 L75 42" stroke="#a16207" strokeWidth="2" fill="none"/></svg>,
    'chocalho_pet_3': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -5)"><path d="M60 95 H40 L35 40 H65 Z" fill="#a7f3d0" stroke="#15803d" strokeWidth="2"/></g><g transform="translate(0 5)"><path d="M65 40 H35 V30 C35 24.4772 39.4772 20 45 20 H55 C60.5228 20 65 24.4772 65 30 Z" stroke="#15803d" strokeWidth="2" fill="#dcfce7"/></g><rect x="25" y="48" width="50" height="14" fill="#3b82f6" rx="2"/><path d="M25 55 L75 55" stroke="white" strokeWidth="1" strokeDasharray="2 2"/></svg>,
    'chocalho_pet_4': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M60 95 H40 L35 40 H65 Z" fill="#a7f3d0" stroke="#15803d" strokeWidth="2"/><path d="M65 40 H35 V30 C35 24.4772 39.4772 20 45 20 H55 C60.5228 20 65 24.4772 65 30 Z" stroke="#15803d" strokeWidth="2" fill="#dcfce7"/><rect x="40" y="5" width="20" height="15" rx="5" fill="#ef4444"/><path d="M35 35 Q 20 40, 25 50 T 35 65" stroke="#f43f5e" strokeWidth="3" fill="none"/><path d="M65 35 Q 80 40, 75 50 T 65 65" stroke="#eab308" strokeWidth="3" fill="none"/></svg>,
    'tambor_bexiga_1': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="80" rx="30" ry="10" fill="#d1d5db" stroke="#6b7280" strokeWidth="2"/><path d="M20 80 V 40 H 80 V 80" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2"/><ellipse cx="50" cy="40" rx="30" ry="10" fill="none" stroke="#6b7280" strokeWidth="2"/><path d="M80 20 A 10 10 0 1 1 70 10" fill="#f43f5e" stroke="#9f1239" strokeWidth="2"/><path d="M70 10 L 68 5" stroke="#9f1239" strokeWidth="2"/><path d="M70 10 L 65 12" stroke="#9f1239" strokeWidth="2"/><path d="M20 15 L40 30" stroke="#334155" strokeDasharray="2 2" strokeWidth="1.5"/></svg>,
    'tambor_bexiga_2': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="80" rx="30" ry="10" fill="#d1d5db"/><path d="M20 80 V 40 H 80 V 80" fill="#e5e7eb"/><ellipse cx="50" cy="40" rx="30" ry="10" fill="#f472b6" stroke="#db2777" strokeWidth="2"/><path d="M18 45 C 10 45, 10 35, 18 35" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/><path d="M82 45 C 90 45, 90 35, 82 35" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/></svg>,
    'tambor_bexiga_3': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="80" rx="30" ry="10" fill="#d1d5db" stroke="#6b7280" strokeWidth="2"/><path d="M20 80 V 40 H 80 V 80" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2"/><ellipse cx="50" cy="40" rx="30" ry="10" fill="#f472b6" stroke="#db2777" strokeWidth="2"/><path d="M30 50 L 70 55" stroke="#3b82f6" strokeWidth="3"/><path d="M30 60 L 70 65" stroke="#84cc16" strokeWidth="3"/><path d="M30 70 L 70 75" stroke="#f59e0b" strokeWidth="3"/><g transform="translate(15 20) rotate(15)"><path d="M0 0 L 10 10 L 0 20 Z" fill="#fde047"/></g><g transform="translate(80 60) rotate(-30)"><path d="M0 0 L 5 5 L 0 10 Z" fill="#a78bfa"/></g></svg>,
    'tambor_bexiga_4': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="80" rx="30" ry="10" fill="#d1d5db" stroke="#6b7280" strokeWidth="2"/><path d="M20 80 V 40 H 80 V 80" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2"/><ellipse cx="50" cy="40" rx="30" ry="10" fill="#f472b6" stroke="#db2777" strokeWidth="2"/><g transform="rotate(-30 40 30)"><rect x="30" y="-15" width="6" height="40" rx="3" fill="#a16207"/><circle cx="33" cy="-18" r="4" fill="#f97316"/></g><g transform="rotate(30 60 30)"><rect x="60" y="-15" width="6" height="40" rx="3" fill="#a16207"/><circle cx="63" cy="-18" r="4" fill="#3b82f6"/></g></svg>,
    'pandeiro_guizo_1': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#fef08a" stroke="#ca8a04" strokeWidth="3"/><path d="M30 40 C 40 20, 60 20, 70 40" stroke="#f43f5e" strokeWidth="2" fill="none"/><path d="M35 50 C 40 40, 60 40, 65 50" stroke="#3b82f6" strokeWidth="2" fill="none"/><path d="M40 60 C 45 55, 55 55, 60 60" stroke="#22c55e" strokeWidth="2" fill="none"/></svg>,
    'pandeiro_guizo_2': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#fef08a" stroke="#ca8a04" strokeWidth="3"/><circle cx="50" cy="10" r="3" fill="#6b7280"/><circle cx="90" cy="50" r="3" fill="#6b7280"/><circle cx="50" cy="90" r="3" fill="#6b7280"/><circle cx="10" cy="50" r="3" fill="#6b7280"/><path d="M85 10 L95 20 M90 10 L90 25" stroke="#334155" strokeWidth="2"/><rect x="88" y="8" width="10" height="20" rx="2" fill="#d1d5db"/></svg>,
    'pandeiro_guizo_3': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="#ca8a04" strokeWidth="3"/><circle cx="50" cy="10" r="3" fill="#6b7280"/><path d="M50 10 C 60 20, 75 20, 80 15" stroke="#db2777" fill="none" strokeWidth="2"/><g transform="translate(80 15)"><circle cx="0" cy="0" r="5" fill="#eab308"/><circle cx="0" cy="0" r="2" fill="white"/></g></svg>,
    'pandeiro_guizo_4': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#fef08a" stroke="#ca8a04" strokeWidth="3"/><circle cx="50" cy="10" r="5" fill="#eab308"/><circle cx="50" cy="90" r="5" fill="#eab308"/><circle cx="10" cy="50" r="5" fill="#eab308"/><circle cx="90" cy="50" r="5" fill="#eab308"/><circle cx="25" cy="25" r="5" fill="#eab308"/><circle cx="75" cy="25" r="5" fill="#eab308"/><circle cx="25" cy="75" r="5" fill="#eab308"/><circle cx="75" cy="75" r="5" fill="#eab308"/><path d="M45 45 V 60 H 55" stroke="#3b82f6" strokeWidth="3" fill="none"/><circle cx="45" cy="45" r="5" fill="#3b82f6"/></svg>,
    
    'violao_elasticos_1': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="30" width="70" height="40" rx="5" fill="#e9d5ff" stroke="#a855f7" strokeWidth="2"/><rect x="15" y="25" width="70" height="50" rx="5" fill="#c084fc" stroke="#7e22ce" strokeWidth="2"/><path d="M75 15 L 90 25 M 90 15 L 75 25" stroke="#334155" strokeWidth="2" strokeLinecap="round"/><circle cx="50" cy="50" r="15" fill="none" stroke="#7e22ce" strokeWidth="2" strokeDasharray="4 2"/></svg>,
    'violao_elasticos_2': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="25" width="70" height="50" rx="5" fill="#c084fc" stroke="#7e22ce" strokeWidth="2"/><path d="M25,35 Q30,45 40,35 T55,35" stroke="#f43f5e" strokeWidth="3" fill="none"/><path d="M20,65 Q30,55 45,60 T65,60" stroke="#3b82f6" strokeWidth="3" fill="none"/><path d="M70 20 L 80 10 L 85 25 Z" fill="#22c55e"/></svg>,
    'violao_elasticos_3': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="25" width="70" height="50" rx="5" fill="#c084fc" stroke="#7e22ce" strokeWidth="2"/><circle cx="50" cy="50" r="15" fill="#a855f7" stroke="#7e22ce" strokeWidth="2"/><g strokeWidth="2.5"><line x1="10" y1="35" x2="90" y2="35" stroke="#ef4444"/><line x1="10" y1="42" x2="90" y2="42" stroke="#3b82f6"/><line x1="10" y1="50" x2="90" y2="50" stroke="#22c55e"/><line x1="10" y1="58" x2="90" y2="58" stroke="#eab308"/><line x1="10" y1="65" x2="90" y2="65" stroke="#f472b6"/></g></svg>,
    'violao_elasticos_4': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="25" width="70" height="50" rx="5" fill="#c084fc" stroke="#7e22ce" strokeWidth="2"/><circle cx="50" cy="50" r="15" fill="#a855f7" stroke="#7e22ce" strokeWidth="2"/><rect x="25" y="32" width="5" height="46" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5"/><g strokeWidth="2.5"><line x1="10" y1="35" x2="90" y2="35" stroke="#ef4444"/><line x1="10" y1="42" x2="90" y2="42" stroke="#3b82f6"/><line x1="10" y1="50" x2="90" y2="50" stroke="#22c55e"/><line x1="10" y1="58" x2="90" y2="58" stroke="#eab308"/><line x1="10" y1="65" x2="90" y2="65" stroke="#f472b6"/></g></svg>,

    'reco_reco_1': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M60 95 H40 C35 95, 30 90, 30 85 V 40 H70 V 85 C 70 90, 65 95, 60 95 Z" fill="#a7f3d0" stroke="#15803d" strokeWidth="2"/><path d="M70 40 H30 V30 C30 24.4772 34.4772 20 40 20 H60 C65.5228 20 70 24.4772 70 30 Z" stroke="#15803d" strokeWidth="2" fill="#dcfce7"/><rect x="40" y="5" width="20" height="15" rx="5" fill="#ef4444"/></svg>,
    'reco_reco_2': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M60 95 H40 C35 95, 30 90, 30 85 V 40 H70 V 85 C 70 90, 65 95, 60 95 Z" fill="#a7f3d0" stroke="#15803d" strokeWidth="2"/><path d="M70 40 H30 V30 C30 24.4772 34.4772 20 40 20 H60 C65.5228 20 70 24.4772 70 30 Z" stroke="#15803d" strokeWidth="2" fill="#dcfce7"/><path d="M35,45 Q40,55 50,45 T65,45" stroke="#3b82f6" fill="none" strokeWidth="2.5"/><path d="M35,65 Q40,75 50,65 T65,65" stroke="#f43f5e" fill="none" strokeWidth="2.5"/><path d="M80,80 L90,70 L95,85Z" fill="#eab308"/></svg>,
    'reco_reco_3': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M60 95 H40 C35 95, 30 90, 30 85 V 40 H70 V 85 C 70 90, 65 95, 60 95 Z" fill="#a7f3d0" stroke="#15803d" strokeWidth="2"/><g stroke="#15803d" strokeWidth="2"><line x1="30" y1="50" x2="70" y2="50"/><line x1="30" y1="58" x2="70" y2="58"/><line x1="30" y1="66" x2="70" y2="66"/><line x1="30" y1="74" x2="70" y2="74"/><line x1="30" y1="82" x2="70" y2="82"/></g><rect x="15" y="20" width="8" height="60" rx="4" fill="#a16207" stroke="#422006" strokeWidth="1.5"/><circle cx="19" cy="18" r="5" fill="#f97316"/></svg>,
    'reco_reco_4': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-15 50 50)"><path d="M60 95 H40 C35 95, 30 90, 30 85 V 40 H70 V 85 C 70 90, 65 95, 60 95 Z" fill="#a7f3d0" stroke="#15803d" strokeWidth="2"/><g stroke="#15803d" strokeWidth="2"><line x1="30" y1="50" x2="70" y2="50"/><line x1="30" y1="58" x2="70" y2="58"/><line x1="30" y1="66" x2="70" y2="66"/><line x1="30" y1="74" x2="70" y2="74"/><line x1="30" y1="82" x2="70" y2="82"/></g></g><g transform="rotate(30 70 50)"><rect x="65" y="10" width="8" height="50" rx="4" fill="#a16207" stroke="#422006" strokeWidth="1.5"/></g><path d="M60 30 Q 70 40 80 40" stroke="#334155" strokeWidth="2" fill="none" strokeDasharray="3 3"/></svg>,

    'maraca_1': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="35" rx="20" ry="25" fill="#fecaca" stroke="#b91c1c" strokeWidth="2"/><ellipse cx="50" cy="65" rx="20" ry="25" fill="#fecaca" stroke="#b91c1c" strokeWidth="2"/><circle cx="80" cy="70" r="3" fill="#ca8a04"/><circle cx="85" cy="65" r="2" fill="#ca8a04"/><circle cx="75" cy="60" r="4" fill="#ca8a04"/></svg>,
    'maraca_2': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="65" rx="20" ry="25" fill="#fecaca" stroke="#b91c1c" strokeWidth="2"/><circle cx="45" cy="55" r="3" fill="#ca8a04"/><circle cx="50" cy="60" r="2" fill="#ca8a04"/><circle cx="55" cy="52" r="4" fill="#ca8a04"/><path d="M80 70 L 55 60" stroke="#334155" strokeWidth="2" strokeDasharray="3 3"/><path d="M55 60 L 50 65 L 53 58" fill="none" stroke="#334155" strokeWidth="2"/></svg>,
    'maraca_3': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="20" ry="35" fill="#fecaca" stroke="#b91c1c" strokeWidth="2"/><rect x="20" y="48" width="60" height="4" fill="#fbbf24"/><rect x="45" y="80" width="10" height="15" fill="#a16207" stroke="#422006" strokeWidth="1.5"/></svg>,
    'maraca_4': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="40" rx="20" ry="35" fill="#fecaca" stroke="#b91c1c" strokeWidth="2"/><rect x="45" y="70" width="10" height="25" fill="#a16207" stroke="#422006" strokeWidth="1.5"/><path d="M30 20 Q 20 30, 30 40" stroke="#f43f5e" strokeWidth="3" fill="none"/><path d="M70 20 Q 80 30, 70 40" stroke="#eab308" strokeWidth="3" fill="none"/></svg>,
    
    'cajon_caseiro_1': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20 80 L30 70 V20 L20 10 Z" fill="#fde68a" stroke="#ca8a04" strokeWidth="2"/><path d="M20 10 L80 10 L90 20 L30 20 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2"/><path d="M80 10 L90 20 V70 L80 80 V10" fill="#fcd34d" stroke="#ca8a04" strokeWidth="2"/><path d="M30 70 L90 70 L80 80 L20 80 Z" fill="#fef3c7" stroke="#ca8a04" strokeWidth="2"/></svg>,
    'cajon_caseiro_2': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20 80 L30 70 V20 L20 10 Z" fill="#fde68a" stroke="#ca8a04" strokeWidth="2"/><path d="M20 10 L80 10 L90 20 L30 20 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2"/><path d="M80 10 L90 20 V70 L80 80 V10" fill="#fcd34d" stroke="#ca8a04" strokeWidth="2"/><path d="M30 70 L90 70 L80 80 L20 80 Z" fill="#fef3c7" stroke="#ca8a04" strokeWidth="2"/><path d="M20 10 L30 20 M80 10 L90 20 M20 80 L30 70 M80 80 L90 70" stroke="#fbbf24" strokeWidth="4"/></svg>,
    'cajon_caseiro_3': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20 80 L30 70 V20 L20 10 Z" fill="#fde68a" stroke="#ca8a04" strokeWidth="2"/><path d="M20 10 L80 10 L90 20 L30 20 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2"/><path d="M80 10 L90 20 V70 L80 80 V10" fill="#fcd34d" stroke="#ca8a04" strokeWidth="2"/><path d="M30 70 L90 70 L80 80 L20 80 Z" fill="#fef3c7" stroke="#ca8a04" strokeWidth="2"/><circle cx="75" cy="45" r="12" fill="none" stroke="#ca8a04" strokeWidth="2" strokeDasharray="4 2"/></svg>,
    'cajon_caseiro_4': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20 80 L30 70 V20 L20 10 Z" fill="#fde68a" stroke="#ca8a04" strokeWidth="2"/><path d="M20 10 L80 10 L90 20 L30 20 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2"/><path d="M80 10 L90 20 V70 L80 80 V10" fill="#fcd34d" stroke="#ca8a04" strokeWidth="2"/><path d="M30 70 L90 70 L80 80 L20 80 Z" fill="#fef3c7" stroke="#ca8a04" strokeWidth="2"/><circle cx="75" cy="45" r="12" fill="#a16207"/><path d="M15 15 C 5 25, 5 35, 15 45" stroke="#3b82f6" strokeWidth="2" fill="none"/><path d="M20 50 L 30 60" stroke="#ef4444" strokeWidth="2"/></svg>,

    'flauta_canudo_1': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(20 50 50)"><rect x="20" y="48" width="60" height="4" rx="2" fill="#3b82f6"/><rect x="20" y="58" width="60" height="4" rx="2" fill="#22c55e"/><rect x="20" y="38" width="60" height="4" rx="2" fill="#ef4444"/></g><path d="M20 20 L30 15 L35 25" stroke="#4b5563" strokeWidth="2" fill="none"/></svg>,
    'flauta_canudo_2': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="8" height="60" rx="3" fill="#3b82f6"/><path d="M32 25 h 8 v 55 h -8 z" fill="#22c55e"/><path d="M44 30 h 8 v 50 h -8 z" fill="#ef4444"/><path d="M85 20 L85 80" stroke="#334155" strokeDasharray="3 3" strokeWidth="1.5"/><path d="M28 80 L 80 25" stroke="#4b5563" strokeWidth="1.5"/></svg>,
    'flauta_canudo_3': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="8" height="60" rx="3" fill="#3b82f6"/><rect x="32" y="25" width="8" height="55" rx="3" fill="#22c55e"/><rect x="44" y="30" width="8" height="50" rx="3" fill="#ef4444"/><rect x="56" y="35" width="8" height="45" rx="3" fill="#eab308"/><rect x="68" y="40" width="8" height="40" rx="3" fill="#8b5cf6"/></svg>,
    'flauta_canudo_4': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g><rect x="20" y="20" width="8" height="60" rx="3" fill="#3b82f6"/><rect x="32" y="25" width="8" height="55" rx="3" fill="#22c55e"/><rect x="44" y="30" width="8" height="50" rx="3" fill="#ef4444"/><rect x="56" y="35" width="8" height="45" rx="3" fill="#eab308"/><rect x="68" y="40" width="8" height="40" rx="3" fill="#8b5cf6"/></g><rect x="15" y="48" width="68" height="4" fill="#fbbf24"/></svg>,
    
    'tambor_lata_1': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="85" rx="35" ry="12" fill="#d1d5db" stroke="#6b7280" strokeWidth="2"/><path d="M15 85 V 30 H 85 V 85" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2"/><ellipse cx="50" cy="30" rx="35" ry="12" fill="none" stroke="#6b7280" strokeWidth="2"/></svg>,
    'tambor_lata_2': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="85" rx="35" ry="12" fill="#d1d5db" stroke="#6b7280" strokeWidth="2"/><path d="M15 85 V 30 H 85 V 85" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2"/><ellipse cx="50" cy="30" rx="35" ry="12" fill="none" stroke="#6b7280" strokeWidth="2"/><path d="M25 40 L 75 45" stroke="#3b82f6" strokeWidth="4"/><path d="M25 55 L 75 60" stroke="#84cc16" strokeWidth="4"/><path d="M25 70 L 75 75" stroke="#f59e0b" strokeWidth="4"/></svg>,
    'tambor_lata_3': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="85" rx="35" ry="12" fill="#d1d5db" stroke="#6b7280" strokeWidth="2"/><path d="M15 85 V 30 H 85 V 85" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2"/><ellipse cx="50" cy="30" rx="35" ry="12" fill="#fde047" stroke="#ca8a04" strokeWidth="2"/><path d="M13 35 C 5 35, 5 25, 13 25" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/><path d="M87 35 C 95 35, 95 25, 87 25" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/></svg>,
    'tambor_lata_4': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="85" rx="35" ry="12" fill="#d1d5db" stroke="#6b7280" strokeWidth="2"/><path d="M15 85 V 30 H 85 V 85" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2"/><ellipse cx="50" cy="30" rx="35" ry="12" fill="#fde047" stroke="#ca8a04" strokeWidth="2"/><g transform="rotate(-30 40 30)"><rect x="35" y="-15" width="6" height="50" rx="3" fill="#a16207"/><circle cx="38" cy="-18" r="4" fill="#ef4444"/></g><g transform="rotate(30 60 30)"><rect x="60" y="-15" width="6" height="50" rx="3" fill="#a16207"/><circle cx="63" cy="-18" r="4" fill="#3b82f6"/></g></svg>,

    'default': <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 A40,40,0,1,1,50,90 A40,40,0,1,1,50,10" stroke="black" strokeWidth="2" fill="none"/><text x="50" y="55" text-anchor="middle" font-size="12">Imagem aqui</text></svg>
};
