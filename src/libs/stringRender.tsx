import { Icon } from "@iconify/react/dist/iconify.js";

export const string2render = (str: string) => {
  if (!str) return null;

  const isArrayJson = str.startsWith("[{") && str.endsWith("}]");
  if (isArrayJson) {
    return (
      <ul className="flex flex-col gap-2">
        {JSON.parse(str).map(
          (
            item: {
              support: boolean;
              feature: string;
            },
            index: number
          ) => (
            <li className="flex items-center gap-2" key={index}>
              {item.support ? (
                <Icon
                  className="text-primary min-w-[24px]"
                  icon="ri:checkbox-line"
                  width={24}
                />
              ) : (
                <Icon
                  className="text-danger min-w-[24px]"
                  icon="ri:checkbox-indeterminate-line"
                  width={24}
                />
              )}
              <p className="text-default-500">{item.feature}</p>
            </li>
          )
        )}
      </ul>
    );
  }
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(str);
  if (isHtml) {
    return <div dangerouslySetInnerHTML={{ __html: str }}></div>;
  }

  return (
    <div>
      {str
        .split("\n")
        .map((item, index) =>
          item ? <p key={index}>{item}</p> : <br key={index} />
        )}
    </div>
  );
};
