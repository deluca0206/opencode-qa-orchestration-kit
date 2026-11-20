# Método causal
Comece pelo endpoint ou evento que o EV demonstra. Localize registro da rota,
binding do componente e handler chamado. Leia cada trecho antes de citá-lo.
Identifique o predicado que diferencia o esperado do observado: entrada vazia,
estado ausente, erro não tratado, autorização ou transformação.

Se o handler só exibe erro de outro serviço, não o nomeie causa raiz. Procure
a condição anterior e diga onde a evidência termina. Quando duas hipóteses
explicam o mesmo EV, proponha um teste que produza resultados diferentes para
elas. Exemplo: payload inválido versus sessão expirada requer comparar resposta
com entrada válida e mesma identidade sintética, não simplesmente repetir.

Sem acesso runtime, a condição é fato de código, mas sua participação no
incidente continua hipótese. Sem leitura, não há correlação concluída.
