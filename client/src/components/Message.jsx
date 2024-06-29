import React from "react";
import { useSelector } from "react-redux";
import profilepic from "../assets/profilepic.jpeg";
export default function Message() {
  const { user } = useSelector((state) => state.users);
  return (
    <div className="text-custom-gray-text bt-2 bb-2 flex gap-2 ">
      <img
        src={profilepic}
        className="h-10 aspect-square rounded-full m-2"
        alt=""
      />
      <p className="p-2">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus,
        voluptates facilis? Sequi et rerum odio ducimus molestias corporis
        suscipit nihil dolore beatae illum?Lorem ipsum, dolor sit amet
        consectetur adipisicing elit. Repellendus dolore quaerat cumque,
        accusamus excepturi provident asperiores exercitationem. Voluptate,
        facere aspernatur? Perferendis voluptatum vitae tempora tenetur
        repellendus! Atque aliquid, soluta velit beatae pariatur magni
        laboriosam odio officia, aliquam quae et placeat quod ducimus eum
        accusamus temporibus praesentium ipsam adipisci enim, tenetur dolore
        corporis. Commodi dicta at voluptas esse! Aut, tenetur perspiciatis.
        Distinctio alias ut harum totam eligendi iusto velit accusantium autem
        pariatur. Laboriosam sint nihil quibusdam quo delectus eius beatae
        dignissimos repudiandae, iusto, impedit vel aperiam veniam nemo ducimus
        ipsa saepe expedita quaerat nobis deserunt porro debitis, error ab fugit
        dolorum.
      </p>
    </div>
  );
}
