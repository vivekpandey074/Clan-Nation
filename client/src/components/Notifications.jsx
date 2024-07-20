import React, { useState } from "react";

export default function Notifications() {
  const [allNotification, setAllNotifications] = useState([]);

  return (
    <div>
      <div
        onClick={() => {
          navigate(`/chat/clan/$`);
        }}
        className="flex gap-2 p-4 cursor-pointer  ease-out duration-300 hover:bg-black rounded-lg  "
      >
        <div className="flex flex-col text-custom-gray-text  grow-[3]">
          <h1 className="text-xl">New Friend Request </h1>
          <div>
            <button>Accept</button>
            <button>Reject</button>
          </div>
          <p className="text-sm">
            this is content of notification Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Necessitatibus, qui ratione. Sit aut
            atque optio totam, dicta culpa veniam minima molestiae mollitia eum
            magnam cum quidem molestias. Corporis veritatis, quidem nam vel,
            incidunt nesciunt delectus eaque dolores nobis eveniet, adipisci
            modi! Nam placeat sed ratione possimus unde dolorem modi. Non saepe
            fugiat accusamus, quaerat fuga autem minus expedita, neque amet
            cumque itaque tempore atque perspiciatis tenetur, aliquid sit ex
            animi eligendi quam quisquam ipsum cupiditate a! Consectetur nisi
            enim consequuntur magnam praesentium necessitatibus quam deleniti
            illum, aliquam at voluptatibus nemo eveniet tempora ab impedit quos
            veniam reprehenderit expedita reiciendis dicta soluta optio. Facere
            corrupti blanditiis repellat ut fugit quos dolor voluptas unde
            exercitationem pariatur dolorem ex fuga, quaerat, modi suscipit
            consequatur odit quisquam maxime veritatis ipsam sint molestiae?
            Expedita rem dignissimos nulla earum beatae aperiam delectus
            obcaecati. Illum ratione cum unde aperiam non sunt maxime sed
            cumque, consequuntur iusto est assumenda voluptate eos veniam
            corrupti repudiandae fuga rerum? Odit dolorum odio voluptate!
            Corporis, totam quas doloribus eligendi omnis dolorem. Temporibus
            eaque, vitae alias atque cupiditate facilis laboriosam officia nisi,
            tenetur nesciunt repellat dolore magnam a ipsam numquam iste eos
            magni nostrum accusamus odio ullam quos perspiciatis? Explicabo
            perspiciatis voluptates itaque.
          </p>
          <p className="text-sm"></p>
        </div>
      </div>
    </div>
  );
}
