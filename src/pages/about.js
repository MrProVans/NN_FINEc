import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";

/**
 * @param {any} _ctx
 */
export async function aboutPage(_ctx) {
  const body = `
    <section class="stack">
      <img src="assets/bank.png" class="about-image">
      <p>
        Мгновение - и вы окажетесь в Нижнем Новгороде XIX века. Воздух здесь густ не только от 
        волжского тумана, но и от запаха больших денег, рискованных сделок и гениальных афер.
      </p>
      <p>
        Вы - не просто зритель. Вам предстоит надеть маску, вжиться в роль и пройти по следам 
        одного из самых изобретательных мошенников своей эпохи.
      </p>
      <p>
        Каждое здание на этом маршруте - не просто фасад, а свидетель хитрой махинации. 
        Каждая история - урок финансовой грамотности, который вам преподадут через обман. 
      </p>
      <p>
        Включите бдительность, доверяйте интуиции и будьте готовы разгадывать замыслы. 
        Ваше приключение начинается там, где кончается честность
      </p>
    </section>
  `;

  return {
    activeNav: "about",
    html: card({
      title: "О проекте",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "На главную", href: "#/home" })}
          ${linkButton({ label: "Выбрать маршрут", href: "#/excursions", variant: "primary" })}
        </div>
      `,
    }),
  };
}
