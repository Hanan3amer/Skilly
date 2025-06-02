const MessageItem = ({ username, message, avatarUrl, className = "" }) => {
  return (
    <div className={`flex gap-4 self-end ${className}`}>
      <article className="flex flex-col grow shrink-0 basis-0 w-fit">
        <h3 className="self-end text-base leading-none text-black font-bold">
          {username}
        </h3>
        <p className="mt-3.5 text-sm text-blue-950">{message}</p>
      </article>
      <img
        src={avatarUrl}
        alt={`${username}'s avatar`}
        className="object-contain shrink-0 self-start aspect-[1.16] w-[50px]"
      />
    </div>
  );
};

export default MessageItem;
