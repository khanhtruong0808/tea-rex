import { SiUbereats } from "react-icons/si";
import { SiGrubhub } from "react-icons/si";
import { NavLink, Route } from "react-router-dom";

const DeliveryOption = () => {
  const deliveryIcons = [
    {
      name: "Ubereats",
      path: "https://www.ubereats.com/?utm_source=Bing_Brand&utm_campaign=CM2336875-search-bing-brand_1_-99_US-National_e_web_acq_cpc_en_T1_Generic_Exact_ubereats_kwd-77997032002475:loc-190__1247947000581029_e_c&campaign_id=638332816&adg_id=1247947000581029&fi_id=&match=e&net=o&dev=c&dev_m=&ad_id=&cre=&kwid=kwd-77997032002475:loc-190&kw=ubereats&placement=&tar=&gclid=98c86a0534fc11a5295e0f10c4c6e236&gclsrc=3p.ds&&msclkid=98c86a0534fc11a5295e0f10c4c6e236",
      icon: <SiUbereats />,
    },
    {
      name: "Grubhub",
      path: "https://www.grubhub.com/?utm_source=bing&utm_medium=cpc&utm_campaign=p:M+%7C+a:DINE+%7C+b:B+%7C+c:GRUB+%7C+d:NA+%7C+m:E+%7C+g:NAT+%7C+t:ALL+%7C+exp:&utm_term=grubhub&utm_content=acct_id-3329632822:camp_id-72599190:adgroup_id-1925053136:kwd-26680366685:loc-190:creative_id-:ext_id-:matchtype_id-e:network-o:device-c:loc_interest-:loc_physical-89039&gclid=1424431abb741a1888af260f4b3d2c1e&gclsrc=3p.ds&msclkid=1424431abb741a1888af260f4b3d2c1e",
      icon: <SiGrubhub />,
    },
  ];
  return (
    <div className="flex items-center justify-center gap-6">
      {deliveryIcons.map((deliveryIcons) => (
        <NavLink
          to={deliveryIcons.path}
          key={deliveryIcons.name}
          className="flex gap-8"
        >
          <li className="flex rounded-full bg-violet-400 px-3 py-3 text-6xl font-bold text-white transition hover:scale-125">
            {deliveryIcons.icon}
          </li>
        </NavLink>
      ))}
    </div>
  );
};
export default DeliveryOption;
