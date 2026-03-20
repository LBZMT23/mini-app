import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronLeft, ChevronDown, Upload, Trash2 } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { cn } from '../utils/cn';

export const Signup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { myRegistrations, setMyRegistrations, showToast } = useAppContext();
  
  const [teamName, setTeamName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [teamImg, setTeamImg] = useState('');
  const [capName, setCapName] = useState('');
  const [capPhone, setCapPhone] = useState('');
  const [city, setCity] = useState('');
  const [remark, setRemark] = useState('');
  const [members, setMembers] = useState([{ id: 1, name: '', phone: '' }]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  useEffect(() => {
    const reg = myRegistrations[Number(id)];
    if (reg) {
      setTeamName(reg.teamName);
      setSlogan(reg.slogan);
      setTeamImg(reg.teamImg);
      setCapName(reg.capName);
      setCapPhone(reg.capPhone);
      setCity(reg.city);
      setMembers(JSON.parse(JSON.stringify(reg.members)));
      setIsAgreed(true);
    }
  }, [id, myRegistrations]);

  const handleAddMember = () => {
    if (members.length >= 20) return showToast('最多只能添加20名队员');
    const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    setMembers([...members, { id: newId, name: '', phone: '' }]);
  };

  const handleRemoveMember = (id: number) => {
    if (members.length <= 1) return showToast('至少需要1名队员');
    setMembers(members.filter(m => m.id !== id));
  };

  const handleMemberChange = (id: number, field: 'name' | 'phone', value: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const simulateUpload = () => {
    showToast('模拟上传中...');
    setTimeout(() => {
      setTeamImg('https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=400&q=80');
    }, 500);
  };

  const handleSubmit = () => {
    if (!teamName) return showToast('请输入队伍名称');
    if (!teamImg) return showToast('请上传队伍风采照片');
    if (!capName) return showToast('请输入队长姓名');
    if (capPhone.length !== 11) return showToast('请输入正确的队长联系电话');
    if (!city) return showToast('请选择所在城市');
    if (members.length < 10 || members.length > 20) return showToast('队员人数需在10-20人之间');
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name) return showToast(`请输入队员 ${i+1} 的姓名`);
      if (members[i].phone.length !== 11) return showToast(`请输入队员 ${i+1} 的正确手机号`);
    }
    if (!isAgreed) return showToast('请阅读并同意《参赛须知》');

    const loadingEl = document.createElement('div');
    loadingEl.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-xl text-sm z-[10000]';
    loadingEl.textContent = '提交中...';
    document.body.appendChild(loadingEl);

    setTimeout(() => {
      loadingEl.remove();
      showToast('提交成功！');
      
      setMyRegistrations(prev => ({
        ...prev,
        [Number(id)]: {
          auditStatus: 'pending',
          popStatus: 'none',
          popImages: [],
          teamName,
          slogan,
          teamImg,
          capName,
          capPhone,
          city,
          members: [...members]
        }
      }));
      
      setTimeout(() => {
        navigate(`/my-registration/${id}`, { replace: true });
      }, 1000);
    }, 1000);
  };

  return (
    <PageWrapper type="slide">
      <div className="fixed top-0 left-0 w-full h-[88px] bg-white/85 backdrop-blur-[20px] flex items-end justify-center pb-3 z-[100] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
        <div className="absolute left-5 bottom-3 w-8 h-8 flex items-center justify-center cursor-pointer" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-[#111]" strokeWidth={2.5} />
        </div>
        <div className="text-[17px] font-bold text-[#111]">填写报名信息</div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[88px] pb-[140px] scrollbar-hide">
        <div className="relative m-5 bg-white/70 backdrop-blur-[20px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white z-[40]">
          <h2 className="text-[18px] font-extrabold mb-5 flex items-center text-[#111]">
            <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2"></div>队伍信息
          </h2>
          <div className="mb-4">
            <label className="text-sm font-bold text-[#333] mb-2 block">队伍名称<span className="text-[#e11d48] ml-1">*</span></label>
            <input type="text" className="w-full h-12 bg-white border border-transparent rounded-[14px] px-4 text-[15px] outline-none transition-all duration-200 focus:border-[#ff5e00]/40 focus:shadow-[0_0_0_3px_rgba(255,94,0,0.1)] shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)]" placeholder="2-20个字符" maxLength={20} value={teamName} onChange={e => setTeamName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="text-sm font-bold text-[#333] mb-2 block">参赛口号</label>
            <input type="text" className="w-full h-12 bg-white border border-transparent rounded-[14px] px-4 text-[15px] outline-none transition-all duration-200 focus:border-[#ff5e00]/40 focus:shadow-[0_0_0_3px_rgba(255,94,0,0.1)] shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)]" placeholder="展现队伍风采的口号（选填）" maxLength={30} value={slogan} onChange={e => setSlogan(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="text-sm font-bold text-[#333] mb-2 block">队伍风采照片<span className="text-[#e11d48] ml-1">*</span></label>
            <div className="w-full h-[140px] bg-[#f9f9fa] border-2 border-dashed border-[#ddd] rounded-[16px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden active:bg-[#f0f0f0]" onClick={simulateUpload}>
              {!teamImg ? (
                <>
                  <Upload className="w-8 h-8 mb-2 text-[#999]" />
                  <div className="text-[13px] text-[#999]">点击上传团队合照</div>
                </>
              ) : (
                <img src={teamImg} className="absolute inset-0 w-full h-full object-cover z-[2]" alt="preview" />
              )}
            </div>
          </div>
        </div>

        <div className="relative m-5 bg-white/70 backdrop-blur-[20px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white z-[30]">
          <h2 className="text-[18px] font-extrabold mb-5 flex items-center text-[#111]">
            <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2"></div>队长信息
          </h2>
          <div className="mb-4">
            <label className="text-sm font-bold text-[#333] mb-2 block">队长姓名<span className="text-[#e11d48] ml-1">*</span></label>
            <input type="text" className="w-full h-12 bg-white border border-transparent rounded-[14px] px-4 text-[15px] outline-none transition-all duration-200 focus:border-[#ff5e00]/40 focus:shadow-[0_0_0_3px_rgba(255,94,0,0.1)] shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)]" placeholder="请输入真实姓名" value={capName} onChange={e => setCapName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="text-sm font-bold text-[#333] mb-2 block">联系电话<span className="text-[#e11d48] ml-1">*</span></label>
            <input type="tel" className="w-full h-12 bg-white border border-transparent rounded-[14px] px-4 text-[15px] outline-none transition-all duration-200 focus:border-[#ff5e00]/40 focus:shadow-[0_0_0_3px_rgba(255,94,0,0.1)] shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)]" placeholder="11位手机号" maxLength={11} value={capPhone} onChange={e => setCapPhone(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="text-sm font-bold text-[#333] mb-2 block">所在城市<span className="text-[#e11d48] ml-1">*</span></label>
            <div className={cn("relative w-full", isCityOpen && "open")}>
              <div 
                className={cn("w-full h-12 bg-white border border-transparent rounded-[14px] px-4 text-[15px] flex justify-between items-center cursor-pointer shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)]", city ? "text-[#111]" : "text-[#999]")}
                onClick={() => setIsCityOpen(!isCityOpen)}
              >
                <span>{city || '请选择城市'}</span>
                <ChevronDown className={cn("w-[18px] h-[18px] transition-transform duration-400", isCityOpen && "rotate-180")} />
              </div>
              <div className={cn(
                "absolute top-[calc(100%+8px)] left-0 w-full bg-[#f8f9fa]/96 backdrop-blur-[30px] border-[1.5px] border-white rounded-[20px] p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.12)] z-[50] transition-all duration-350 origin-top",
                isCityOpen ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible -translate-y-2.5 scale-95"
              )}>
                {['北京', '上海', '广州', '深圳', '成都'].map(c => (
                  <div 
                    key={c}
                    className="p-[14px_16px] text-base text-[#333] font-medium rounded-[14px] cursor-pointer transition-colors hover:bg-black/5 active:bg-black/5 mb-1 last:mb-0"
                    onClick={() => { setCity(c); setIsCityOpen(false); }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative m-5 bg-white/70 backdrop-blur-[20px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white z-[20]">
          <h2 className="text-[18px] font-extrabold mb-5 flex items-center text-[#111]">
            <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2"></div>队员信息 (限10-20人)
          </h2>
          <div>
            {members.map((m, idx) => (
              <div key={m.id} className="bg-white rounded-[16px] p-4 mb-3 relative border border-[#f0f0f0]">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-bold text-[#ff5e00]">队员 {idx + 1}</div>
                  <div className="text-[13px] text-[#e11d48] flex items-center cursor-pointer" onClick={() => handleRemoveMember(m.id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" />删除
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <input type="text" className="flex-1 h-10 bg-[#f9f9fa] border-none rounded-xl px-3 text-sm outline-none" placeholder="姓名" value={m.name} onChange={e => handleMemberChange(m.id, 'name', e.target.value)} />
                  <input type="tel" className="flex-1 h-10 bg-[#f9f9fa] border-none rounded-xl px-3 text-sm outline-none" placeholder="手机号" maxLength={11} value={m.phone} onChange={e => handleMemberChange(m.id, 'phone', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full h-[50px] border-[1.5px] border-dashed border-[#ff5e00] rounded-[16px] text-[#ff5e00] flex items-center justify-center text-[15px] font-bold cursor-pointer mt-2.5 bg-[#fff0e6] active:scale-[0.98] transition-transform" onClick={handleAddMember}>
            + 添加队员
          </div>
        </div>

        <div className="relative m-5 bg-white/70 backdrop-blur-[20px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white z-[10]">
          <h2 className="text-[18px] font-extrabold mb-5 flex items-center text-[#111]">
            <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2"></div>补充说明
          </h2>
          <textarea className="w-full h-[80px] bg-white border border-transparent rounded-[14px] p-[12px_16px] text-[15px] outline-none resize-none shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)]" placeholder="填写其他需要说明的事项（选填）" maxLength={200} value={remark} onChange={e => setRemark(e.target.value)}></textarea>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-[15px] p-[16px_20px_34px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-[100]">
        <div className="flex items-center justify-center mb-4 text-[13px] text-[#666]" onClick={() => setIsAgreed(!isAgreed)}>
          <div className={cn("w-[18px] h-[18px] border-[1.5px] rounded border-[#ccc] mr-2 flex items-center justify-center transition-all cursor-pointer", isAgreed && "bg-[#ff5e00] border-[#ff5e00]")}>
            {isAgreed && <div className="w-1 h-2 border-solid border-white border-b-2 border-r-2 rotate-45 -mt-0.5"></div>}
          </div>
          <span>我已阅读并同意<span className="text-[#ff5e00] cursor-pointer" onClick={(e) => { e.stopPropagation(); showToast('阅读参赛须知'); }}>《参赛须知》</span></span>
        </div>
        <div className="h-[56px] bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] text-white rounded-[28px] flex items-center justify-center text-[17px] font-extrabold cursor-pointer shadow-[0_8px_20px_rgba(255,94,0,0.2)]" onClick={handleSubmit}>
          提交报名
        </div>
      </div>
    </PageWrapper>
  );
};
